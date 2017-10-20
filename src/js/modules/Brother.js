// convert to the KH940 / KH930 format
// https://github.com/stg/knittington/blob/master/doc/kh940_format.txt

const Brother = function() {};

Brother.prototype = {
  convert: function(input, rows, stitches) {
    // file data
    const data = new Uint8Array(0x8000);

    // sizing
    const memoBytes = Math.ceil(rows / 2);
    const rowNibbles = Math.ceil(stitches / 4);
    const dataBytes = Math.ceil(rowNibbles * rows / 2);
    const totalBytes = memoBytes + dataBytes;
    const rowPadding = (rowNibbles * 4) - stitches;
    const offsetStart = ((rowNibbles * 4 * rows) % 8 == 0) ? false : true;

    // headers
    const offset = 120;
    const patternNumber = 901;
    this.writeHeader(data, 0, offset, rows, stitches, patternNumber);
    this.writeHeader(data, 7, 0, 0, 0, 902);
    this.writeConstants(data, offset, totalBytes);

    // format data
    const memo = new Uint8Array(memoBytes);
    const pattern = new Uint8Array(dataBytes);
    this.writeInputToPattern(input, pattern, stitches, offsetStart, rowPadding);

    // write memo and pattern to file data
    let address = 0x7EDF;

    for (let i=memo.length-1; i>-1; i-=1) {
      data[address] = memo[i];
      address -= 1;
    }

    for (let i=pattern.length-1; i>-1; i-=1) {
      data[address] = pattern[i];
      address -= 1;
    }

    // log output
    this.logs = [];
    this.writeToLogs(
      'Rows:', rows, 'Stitches:', stitches, 'Data Size:', input.length, '<br />',
      'Memo Bytes:', memoBytes, 'Data Bytes:', dataBytes, 'Row Nibbles:', rowNibbles, 'Offset Data:', offsetStart, 'Row Padding:', rowPadding, '<br />',
      this.getHeader(data, 0), '<br />',
      this.sampleHex(pattern)
    );

    return data;
  },

  copyValue: function(data, index, bytes, value) {
    // copy 8-bit value to memory locations
    while (bytes > 0) {
      bytes -= 1;
      data[index + bytes] = value;
    }
  },

  writeInputToPattern: function(input, pattern, stitches, offsetStart, rowPadding) {
    // write pattern
    let counter = offsetStart ? 4 : 0;

    for (let i=0; i<input.length; i+=1) {
      let shift = 1;

      // pad if row start
      if (i % stitches == 0) {
        shift += rowPadding;
        counter += rowPadding;
      }

      // write bit
      let byte = Math.floor(counter / 8);
      pattern[byte] <<= shift;
      pattern[byte] |= input[i];

      // increment counter
      counter += 1;
    }
  },

  writeIndex: function(data, index, bytes, value) {
    // write n-bit value at location
    let offset = 0;

    while (bytes > 0) {
      bytes -= 1;
      data[index + offset] = (value >> (bytes * 8)) & 0xFF;
      offset += 1;
    }
  },

  decimalToNibble3: function(num) {
    // convert number to 3 digit nibbles

    const nib0 = Math.floor(num / 100) & 0xff;
    const nib1 = Math.floor((num % 100) / 10) & 0xff;
    const nib2 = (num % 10) & 0xff;

    return ((nib0 << 8) + (nib1 << 4) + nib2);
  },

  writeHeader: function(data, address, offset, rows, stitches, patternNumber) {
    // header is structured in nibbles
    // OO OO HH HW WW ON NN
    // offset, height, width, 0x0, number

    const height = this.decimalToNibble3(rows);
    const width = this.decimalToNibble3(stitches);

    this.writeIndex(data, address + 0x0, 2, this.decimalToNibble3(offset));
    this.writeIndex(data, address + 0x2, 3, (height << 12) + width);
    this.writeIndex(data, address + 0x5, 2, this.decimalToNibble3(patternNumber));
  },

  writeConstants: function(data, offset, size) {
    // NOTE: *requires update in future if more than one pattern is to be loaded
    const nextOffset = offset + size;
    const start = offset + size - 1;

    //this.copyValue(data, 0x7EE0, 7, 0x55);        // AREA0
    this.copyValue(data, 0x7EE7, 25, 0x00);       // AREA1
    // CONTROL_DATA
    this.writeIndex(data, 0x7F00, 2, nextOffset); // PATTERN_PTR1 *
    this.writeIndex(data, 0x7F02, 2, 0x0001);     // UNK1
    //this.writeIndex(data, 0x7F04, 2, nextOffset); // PATTERN_PTR0 *
    //this.writeIndex(data, 0x7F06, 2, offset);     // LAST_BOTTOM *
    //this.writeIndex(data, 0x7F08, 2, 0x0000);     // UNK2
    //this.writeIndex(data, 0x7F0A, 2, start);      // LAST_TOP
    //this.writeIndex(data, 0x7F0C, 4, 0x00008100); // UNK3
    this.writeIndex(data, 0x7F0C, 4, 0x00008300); // UNK3
    this.writeIndex(data, 0x7F10, 2, 0x7FF2);     // HEADER_PTR *
    this.writeIndex(data, 0x7F12, 2, 0x0000);     // UNK_PTR
    this.writeIndex(data, 0x7F14, 3, 0x000000);   // UNK4
    // /CONTROL_DATA
    this.copyValue(data, 0x7F17, 25, 0x00);       // AREA2
    this.copyValue(data, 0x7F30, 186, 0x00);      // AREA3
    this.copyValue(data, 0x7FEC, 19, 0x00);       // AREA4
    this.writeIndex(data, 0x7FEA, 2, 0x2901);     // LOADED_PATTERN *
    //this.writeIndex(data, 0x7FFF, 1, 0x02);       // LAST_BYTE
    this.writeIndex(data, 0x7FFC, 4, 0x30001030);
  },

  writeToLogs: function() {
    let text = '';

    for (let i=0; i<arguments.length; i+=1) {
      text += ' ' + arguments[i];
    }

    this.logs.push(text);
  },

  getLogs: function() {
    return this.logs.join('<br />');
  },

  getHeader: function(data, address) {
    let text = 'HEADER ';

    for (var i=0; i<7; i+=1) {
      text += data[address + i].toString(16) + ' ';
    }

    return text;
  },

  sampleHex: function(data) {
    let sample = 'SAMPLE: ';

    for (var i=0; i<data.length && i<16; i+=1) {
      const val = data[i];
      sample += val.toString(16) + ' ';
    }

    return sample;
  }
};

export default Brother;
