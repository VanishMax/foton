import type { TonConnect, TonConnectOptions } from '@tonconnect/sdk';
import type { TonConnectUI } from '@tonconnect/ui';

export const isTonConnectProvider = (tonConnect: TonConnectUI | TonConnect | TonConnectOptions): tonConnect is TonConnectUI | TonConnect => {
  return ('sendTransaction' in tonConnect && 'onStatusChange' in tonConnect);
}

export const isTonConnectUI = (tonConnect: TonConnectUI | TonConnect): tonConnect is TonConnectUI => {
  return ('closeModal' in tonConnect && 'openModal' in tonConnect && 'uiOptions' in tonConnect && 'modalState' in tonConnect);
}

export const isTonConnect = (tonConnect: TonConnectUI | TonConnect): tonConnect is TonConnect => {
  return ('tracker' in tonConnect && 'walletsList' in tonConnect && 'dappSettings' in tonConnect && 'bridgeConnectionStorage' in tonConnect);
}
