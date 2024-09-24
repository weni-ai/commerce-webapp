import { i18n } from '@/locales';

function sleep(timeInMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });
}

export default {
  async listIntegratedByCategory({ category }) {
    await sleep(500);

    return [
      // {
      //   id: 'abandoned_cart',
      //   title: i18n.global.t('solutions.abandoned_cart.title'),
      //   description: i18n.global.t(
      //     'solutions.abandoned_cart.description',
      //   ),
      // },
    ];
  },

  async listByCategory({ category }) {
    await sleep(500);

    if (category === 'active') {
      return [
        {
          id: 'abandoned_cart',
          title: i18n.global.t('solutions.abandoned_cart.title'),
          description: i18n.global.t('solutions.abandoned_cart.description'),
        },
        {
          id: 'order_status',
          title: i18n.global.t('solutions.order_status.title'),
          description: i18n.global.t('solutions.order_status.description'),
        },
        {
          id: 'recurring_purchase',
          title: i18n.global.t('solutions.recurring_purchase.title'),
          description: i18n.global.t(
            'solutions.recurring_purchase.description',
          ),
        },
      ];
    } else if (category === 'passive') {
      return [
        {
          id: 'order_status_passive',
          title: i18n.global.t('solutions.order_status_passive.title'),
          description: i18n.global.t(
            'solutions.order_status_passive.description',
          ),
        },
        {
          id: 'refer_and_win',
          title: i18n.global.t('solutions.refer_and_win.title'),
          description: i18n.global.t('solutions.refer_and_win.description'),
          globals: [
            'VTEX API App Key',
            'VTEX API App Token',
            'VTEX API App Key MD',
            'VTEX API App Token MD',
            'URL API Vtex',
          ],
        },
      ];
    } else {
      return [];
    }
  },
};
