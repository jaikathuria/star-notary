# Star Notarization Service

Blockchain has the potential to change the way that the world approaches data. This WebAPI demonstrates the use of blockchain to create a Star Notarization Service. 


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the [Node.js® web site](https://nodejs.org/en/).
Use the command line tool of your choice (basically a terminal with `npm` and `node` in PATH)

You will need a bitcoin wallet to obtain your bitcoin address and validate the message using your own personal address. Navigate to [Electrum.org](https://electrum.org/#download) to download and install your bitcoin wallet.
Once you have downloaded and installed the wallet, Use your wallet to sign the message provided by our web application.
### Configuring your project

- Use NPM to install project dependencies.
```bash
npm install
```

### Run the app
- You can use either node or npm (which internally runs node) to run the web app
```bash
npm start
# OR
node index
```

### API Documentation

##### 1. POST `/requestValidation`
The API is used to make the first request in terms of validating the wallet address
Each validation of the wallet address can be used just once to register a star, and must be validated again to register a second star.

Example hit:

```sh
curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'content-type: application/json; charset=utf-8' \
  -d '{
  "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx"
}'
```
Example Response:

```json
{
    "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
    "requestTimeStamp": 1533484863828,
    "message": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx:1533484863828:starRegistry",
    "requestExpiry": 1533485163828,
    "status": {
        "messageSignature": "unavailable",
        "starRegistrationRequest": "pending"
    }
}
```

##### 2. POST `/message-signature/validate`
To validate the wallet address sent in the first request, you'll need to create a signature from the `message` returned in the API.
Then send the signature and the wallet address to this api to validate your wallet signature

Example hit:
```sh
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'content-type: application/json' \
  -d '{
	"address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx", 
	"signature": "H9WEvQBefum9EpDm4mSnyuSuiJT9RE1SPyjWotNN+BJ8KHvEXFRHn9pcOqSDKbxfj9M6XTT8XeP4IsQyYcPXbQg="
}'
```
###### Example Response:

Success:
```json
{
    "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
    "requestTimeStamp": 1533484863828,
    "message": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx:1533484863828:starRegistry",
    "requestExpiry": 1533485163828,
    "status": {
        "messageSignature": "valid",
        "starRegistrationRequest": "granted"
    }
}
```

Failure: (status code 401)
```json
{
    "error": "You don't have a valid Validation Request. A validation request is just valid for next 5 minutes."
}
```

##### 3. POST `/block`
Send the star information for notarization.

Example hit:
```sh
curl -X POST \
  http://localhost:8000/block \
  -H 'content-type: application/json; charset=utf-8' \
  -d '{
  "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
  "star": {
    "declination": "-26° 29'\'' 24.9",
    "rightAscension": "16h 29m 1.0s",
    "story": "Found star using oogle.com/sky/"
  }
}'
```
###### Example Response:

Success:
```json
{
    "hash": "529cbdeedb0263da9e08de5fbeeafb5976846d5534ea838444dc508f36441040",
    "height": 2,
    "body": {
        "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
        "star": {
            "rightAscension": "16h 29m 1.0s",
            "declination": "-26° 29' 24.9",
            "story": "466f756e642073746172207573696e67206f6f676c652e636f6d2f736b792f",
            "constellation": null,
            "magnitude": null
        }
    },
    "time": "1533484902",
    "previousBlockHash": "11fd7a1cda9f861f8073a7b7ce9a0e0c064c7dd5503bf2e8626a9b173a01bcd3"
}
```

##### 4. GET `/stars/address:WALLET_ADDRESS`
Get all the stars registered to this wallet address.

Example hit:
```sh
curl -X GET \
  http://localhost:8000/stars/address:16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx 
```
###### Example Response:

Success:
```json
[
    {
        "hash": "11fd7a1cda9f861f8073a7b7ce9a0e0c064c7dd5503bf2e8626a9b173a01bcd3",
        "height": 1,
        "body": {
            "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
            "star": {
                "rightAscension": "16h 29m 1.0s",
                "declination": "-26° 29' 24.9",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "constellation": null,
                "magnitude": null,
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1533484829",
        "previousBlockHash": "4bbcb03b7930de48a8887f42586cea306042e76068e5861f815d94a293818eb1"
    },
    {
        "hash": "529cbdeedb0263da9e08de5fbeeafb5976846d5534ea838444dc508f36441040",
        "height": 2,
        "body": {
            "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
            "star": {
                "rightAscension": "16h 29m 1.0s",
                "declination": "-26° 29' 24.9",
                "story": "466f756e642073746172207573696e67206f6f676c652e636f6d2f736b792f",
                "constellation": null,
                "magnitude": null,
                "storyDecoded": "Found star using oogle.com/sky/"
            }
        },
        "time": "1533484902",
        "previousBlockHash": "11fd7a1cda9f861f8073a7b7ce9a0e0c064c7dd5503bf2e8626a9b173a01bcd3"
    }
]
```

##### 5. GET `/stars/hash:BLOCK_HASH`
Get the star information on the block whose hash is given.

Example hit:
```sh
curl -X GET \
  http://localhost:8001/stars/hash:11fd7a1cda9f861f8073a7b7ce9a0e0c064c7dd5503bf2e8626a9b173a01bcd3 
```
###### Example Response:

Success:
```json
{
    "hash": "11fd7a1cda9f861f8073a7b7ce9a0e0c064c7dd5503bf2e8626a9b173a01bcd3",
    "height": 1,
    "body": {
        "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
        "star": {
            "rightAscension": "16h 29m 1.0s",
            "declination": "-26° 29' 24.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "constellation": null,
            "magnitude": null,
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1533484829",
    "previousBlockHash": "4bbcb03b7930de48a8887f42586cea306042e76068e5861f815d94a293818eb1"
}
```

##### 6. GET `/block/BLOCK_NO`
Get the star information on the block whose block no is given.

Example hit:
```sh
curl -X GET \
  http://localhost:8001/block/1
```
###### Example Response:

Success:
```json
{
    "hash": "11fd7a1cda9f861f8073a7b7ce9a0e0c064c7dd5503bf2e8626a9b173a01bcd3",
    "height": 1,
    "body": {
        "address": "16wMTQ1ibN2xr1RT9FVcAAQ6tqp3rEYSxx",
        "star": {
            "rightAscension": "16h 29m 1.0s",
            "declination": "-26° 29' 24.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "constellation": null,
            "magnitude": null,
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1533484829",
    "previousBlockHash": "4bbcb03b7930de48a8887f42586cea306042e76068e5861f815d94a293818eb1"
}
```

**Note**: In case you're using Postman, please use `import` function to import the curl commands, body should be sent in `raw` format, in `application/json` content type.
