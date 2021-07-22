# articy-xlsx-loader

Webpack loader to convert `.xlsx` localization files exported by [Articy](http://articy.com) and convert them into JS objects mapping localization IDs to localized strings.

Meant to be used with [Articy Node](https://www.npmjs.com/package/articy-node).

## Install

```
npm install --save-dev articy-xlsx-loader
yarn add -D articy-xlsx-loader
```

## Usage

Add a rule to your webpack config.

```js
module.exports = { 
  module: { 
    rules: [
      { test: /\xlsx$/, loader: "articy-xlsx-loader" }
    ]
  }
}
```

You can then pass the imported JSON object into the `Localization` class in `articy-node`.

```typescript
import { Database } from "articy-node";

// Import Articy JSON data
import GameData from "./exported.articy.json";

// Create a new database
const GameDB = new Database(GameData);

// Add localization data
GameDB.localization.add('en', require('./loc_All objects_en.xlsx'));
```