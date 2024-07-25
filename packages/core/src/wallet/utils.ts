import type { TonConnect } from '@tonconnect/sdk';
import type { TonConnectUI } from '@tonconnect/ui';

export const isTonConnectUI = (tonConnect: TonConnectUI | TonConnect): tonConnect is TonConnectUI => {
  return (tonConnect && 'closeModal' in tonConnect && 'openModal' in tonConnect && 'uiOptions' in tonConnect && 'modalState' in tonConnect);
}

export const isTonConnect = (tonConnect: TonConnectUI | TonConnect): tonConnect is TonConnect => {
  return (tonConnect && 'tracker' in tonConnect && 'walletsList' in tonConnect && 'dappSettings' in tonConnect && 'bridgeConnectionStorage' in tonConnect);
}
