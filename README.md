# electron-quick-start

**Clone and run for a quick way to see an Electron application control a KeepKey.**

This is a minimal Electron application that can talk to a KeepKey. It is written in Typescript and uses jQuery to modify the UI. 

**Use this app along with the [device-client API documentation](https://github.com/keepkey/device-client/blob/documentation-and-node-transport/README.md) to help you get started.**

A basic KeepKey application needs just these files:

- `package.json` - [electron] Points to the app's main file and lists its details and dependencies.
- `main.js` - [electron] Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - [electron] A web page to render. This is the app's **renderer process**.
- `node-transport.ts` - Used by device-client to talk to the device.
- `usb-detector.ts` - Detects when devices are connected and disconnect
- `keepkey-device-handler.ts` - Creates and destroys device-client instances.

You can learn more about the electron components in the [Electron Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start

# Go into the repository
cd electron-quick-start

# Install dependencies
# Note: This was developed and tested with Node version 8.9.3.
npm install

# Compile the typescript into javascript
npm run build

# Run the app
# Note: It won't work if you have another application running that talks to KeepKey
npm start
```

## Notes
- This application assumes that your KeepKey is initialized. If it doesn't work, try initializing it with the KeepKey
  Wallet application.
- The KeepKey wallet application will interfer with the operation of this application. Make sure it isn't running when
  starting this application.
 
