var Transform = require("stream").Transform

module.exports = class HtmlWriterStream extends Transform {
  constructor(options = {}) {
    super(options);
    this.started = false;
  }

  get isHead() {
    return !this.started;
  }

  head(data) {
    // console.log('push head');
    this.push(`<!DOCTYPE html><html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example</title>
  <link href="/bundle.css" rel='stylesheet' type='text/css'>
</head><body>${data}`);

    this.started = false;
  }

  body(data) {
    // console.log('push body:', data);
    this.push(data.toString());
  }

  footer() {
    // console.log('push footer');
    this.push(`<script src="/bundle.js"></script>
  </body>
</html>`);

    // end the stream
    this.push(null);
  }

  _transform(chunk, encoding, done) {
      var data = chunk.toString()
      // console.log('transform chunk', data);
      this.isHead ? this.head(data) : this.body(data);
      done();
  }

  _flush(done) {
      // console.log('flush');
      this.footer();
      this._lastLineData = null
      done();
  }
}
