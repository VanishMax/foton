# @fotonjs/api

A library to fetch the data from TON using [Ton Center API](https://toncenter.com/).

By default, the requests are limited to 1 request per second. If you want more throughput, get the access key from the [@tonapibot in Telegram](https://t.me/tonapibot). The following plans are available:
- Free without access key: 1rps
- Free with access key: 10rps
- Plus for 2.5 TON/month: 25rps
- Advanced for 25 TON/month: 100rps

## Usage

To install the library, run:

```bash
npm install @fotonjs/api
```

Then, create an API Client – the interface with all RPC methods:

```ts
import { createClient } from '@fotonjs/api';

const apiClient = createClient({
  api: 'mainnet',
  authToken: 'your-token',
});
```

Call any of the RPC methods with the Client:

```ts
const account = await apiClient.account({
  address: '0:123...',
});

if (account.data) {
  console.log(account.data.balance);
} else {
  console.error(account.error);
}
```
