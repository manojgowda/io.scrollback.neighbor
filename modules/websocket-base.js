'use strict';

var EventTarget = require('event-target-shim');

/**
 * Shared base for platform-specific WebSocket implementations.
 */
class WebSocketBase extends EventTarget {
  CONNECTING: number;
  OPEN: number;
  CLOSING: number;
  CLOSED: number;

  onclose: ?Function;
  onerror: ?Function;
  onmessage: ?Function;
  onopen: ?Function;

  binaryType: ?string;
  bufferedAmount: number;
  extension: ?string;
  protocol: ?string;
  readyState: number;
  url: ?string;

  constructor(url: string, protocols: ?any) {
    super();
    this.CONNECTING = 0;
    this.OPEN = 1;
    this.CLOSING = 2;
    this.CLOSED = 3;

    if (!protocols) {
      protocols = [];
    }

    this.readyState = this.CONNECTING;
    this.connectToSocketImpl(url);
  }

  close(): void {
    if (this.readyState === this.CLOSING ||
        this.readyState === this.CLOSED) {
      return;
    }

    if (this.readyState === this.CONNECTING) {
      this.cancelConnectionImpl();
    }

    this.readyState = this.CLOSING;
    this.closeConnectionImpl();
  }

  send(data: any): void {
    if (this.readyState === this.CONNECTING) {
      throw new Error('INVALID_STATE_ERR');
    }

    if (typeof data === 'string') {
      this.sendStringImpl(data);
    } else if (data instanceof ArrayBuffer) {
      this.sendArrayBufferImpl(data);
    } else {
      throw new Error('Not supported data type');
    }
  }

  closeConnectionImpl(): void {
    throw new Error('Subclass must define closeConnectionImpl method');
  }

  connectToSocketImpl(): void {
    throw new Error('Subclass must define connectToSocketImpl method');
  }

  cancelConnectionImpl(): void {
    throw new Error('Subclass must define cancelConnectionImpl method');
  }

  sendStringImpl(): void {
    throw new Error('Subclass must define sendStringImpl method');
  }

  sendArrayBufferImpl(): void {
    throw new Error('Subclass must define sendArrayBufferImpl method');
  }
}

module.exports = WebSocketBase;
