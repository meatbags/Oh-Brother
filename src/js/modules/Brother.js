// convert binary array into Brother-ready format

const Brother = function() {};

Brother.prototype = {
  convert: function(input, rows, stitches) {
    // convert input array to brother format
    // https://github.com/stg/knittington/blob/master/doc/kh940_format.txt

    const memoBytes = Math.ceil(rows / 2);
    const rowNibbles = Math.ceil(stitches / 4);
    const dataBytes = Math.ceil(rowNibbles * rows / 2);
    const totalBytes = memoBytes + dataBytes;
    const pad = ((rowNibbles * 4 * rows) % 8 == 0) ? false : true;
    const rowPadding = (rowNibbles * 4) - stitches;
    const offset = 120;

    console.log(
      'Rows:', rows,
      'Stitches:', stitches,
      'Data Size:', input.length
    );
    console.log(
      'Memo Bytes:', memoBytes,
      'Data Bytes:', dataBytes,
      'Row Nibbles:', rowNibbles,
      'Pad Data:', pad,
      'Row Padding:', rowPadding
    );

    // create arrays
    const memo = new Uint8Array(memoBytes);
    const pattern = new Uint8Array(dataBytes);
    const data = new Uint8Array(0x8000);

    // write pattern
    let counter = pad ? 4 : 0;

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

    this.logSampleHex(pattern);

    // write memo data and pattern data
    // data is written backwards
    let address = 0x7EDF;
    let size = memo.length + pattern.length;

    for (let i=memo.length-1; i>-1; i-=1) {
      data[address] = memo[i];
      address -= 1;
    }

    for (let i=pattern.length-1; i>-1; i-=1) {
      data[address] = pattern[i];
      address -= 1;
    }

    this.writeHeaders(data, rows, stitches);
    this.writeConstants(data, offset, size);

    return data;
  },

  copyValue: function(data, index, bytes, value) {
    // copy 8-bit value to memory locations
    while (bytes > 0) {
      bytes -= 1;
      data[index + bytes] = value;
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

  writeHeaders: function(data, rows, stitches) {
    // header is structured in nibbles
    // OO OO HH HW WW ON NN
    // Offset, Height, Width, 0x00, Number

    const offset = this.decimalToNibble3(120);
    const height = this.decimalToNibble3(rows);
    const width = this.decimalToNibble3(stitches);
    const heightWidth = (height << 12) + width;
    const patternNum = this.decimalToNibble3(901);

    this.writeIndex(data, 0x0000, 2, offset);
    this.writeIndex(data, 0x0002, 3, heightWidth);
    this.writeIndex(data, 0x0005, 2, patternNum);

    console.log(
      'Offset:', offset.toString(16),
      'Height, Width:', height.toString(16), width.toString(16),
      'Num:', patternNum.toString(16)
    );
  },

  writeConstants: function(data, offset, size) {
    // NOTE: *requires update in future if more than one pattern is to be loaded
    const nextOffset = offset + size;
    const start = offset + size - 1;

    this.copyValue(data, 0x7EE0, 7, 0x55);        // AREA0
    this.copyValue(data, 0x7EE7, 25, 0x00);       // AREA1
    // CONTROL_DATA
    this.writeIndex(data, 0x7F00, 2, nextOffset); // PATTERN_PTR1 *
    this.writeIndex(data, 0x7F02, 2, 0x0001);     // UNK1
    this.writeIndex(data, 0x7F04, 2, nextOffset); // PATTERN_PTR0 *
    this.writeIndex(data, 0x7F06, 2, offset);     // LAST_BOTTOM *
    this.writeIndex(data, 0x7F08, 2, 0x0000);     // UNK2
    this.writeIndex(data, 0x7F0A, 2, start);      // LAST_TOP
    this.writeIndex(data, 0x7F0C, 4, 0x00008100); // UNK3
    this.writeIndex(data, 0x7F10, 2, 0x7FF9);     // HEADER_PTR *
    this.writeIndex(data, 0x7F12, 2, 0x0000);     // UNK_PTR
    this.writeIndex(data, 0x7F14, 3, 0x000000);   // UNK4
    // /CONTROL_DATA
    this.copyValue(data, 0x7F17, 25, 0x00);       // AREA2
    this.copyValue(data, 0x7F30, 186, 0x00);      // AREA3
    this.copyValue(data, 0x7FEC, 19, 0x00);       // AREA4
    this.writeIndex(data, 0x7FEA, 2, 0x1901);     // LOADED_PATTERN *
    this.writeIndex(data, 0x7FFF, 1, 0x02);       // LAST_BYTE
  },

  logSampleHex: function(data) {
    // print some values
    let print = 'SAMPLE: ';

    for (var i=0; i<data.length && i<16; i+=1) {
      const val = data[i];
      print += val.toString(16) + ' ';
    }

    console.log(print);
  }
};

export default Brother;
