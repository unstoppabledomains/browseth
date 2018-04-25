---
title: Setting up for Scripting
category: Example Scripts
order: 1
---

All major browser libraries for interacting with Ethereum use node. To start
scripting with ethereum, you'll need to install node.

#### **Mac:**

`brew install node`

#### **Ubuntu:**

`sudo-apt get node`

<hr>

#### **Create a folder and install Browseth**

`mkdir browseth-scripting && cd browseth-scripting && npm install browseth`

We are also using cli-interact to run scripts from the command line. Feel free
to use your own command line tools if you'd like.

`npm install cli-interact`

Now create your first script:

```
const cliInteract = require('cli-interact');
const { Browseth } = require('browseth'); // Browseth needs to be deconstructed when required

console.log(Browseth);
```

Now check out some of the scripts to get started!
