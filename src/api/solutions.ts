import { i18n } from '@/locales';

function sleep(timeInMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeInMs);
  });
}

export default {
  async listIntegratedByCategory({
    category,
  }: {
    category: string;
  }): Promise<Solution[]> {
    await sleep(500);

    return [];
  },

  async listByCategory({
    category,
  }: {
    category: string;
  }): Promise<Solution[]> {
    await sleep(500);

    if (category === 'active') {
      return [
        {
          id: 'abandoned_cart',
          title: i18n.global.t('solutions.abandoned_cart.title'),
          description: i18n.global.t('solutions.abandoned_cart.description'),
          tip: i18n.global.t('solutions.abandoned_cart.tip'),
          globals: [
            'Base URL do site da loja',
            'UTM da feature',
            'UUID do fluxo Template Message',
            'select:Fluxo inicial:',
            'Categorias a serem bloqueadas (opcional)',
            'Valor minimo de carrinho abandonado',
            'tags:Tags setor nome 1',
            'tags:Tags setor nome 2',
            'tags:Tags setor nome 3',
            'switch:Bloqueio por horário',
            'switch:Bloqueio para testes',
          ],
          mockedValues: {
            'Base URL do site da loja': 'https://grocery.bravtex/',
            'UTM da feature':
              'https://www.seusite.com/pagina-de-produto?utm_source=facebook&utm_medium=social&utm_campaign=lancamento-produto&utm_content=post1',
            'UUID do fluxo Template Message':
              '550e8400-e29b-41d4-a716-446655440000',
            'select:Fluxo inicial:': 'Inscrição evento',
            'Categorias a serem bloqueadas (opcional)': 'Lorem Ipsum',
            'Valor minimo de carrinho abandonado': 'R$ 350,00',
            'tags:Tags setor nome 1': ['Dúvida', 'Compra', 'Segunda via'],
            'tags:Tags setor nome 2': ['Dúvida', 'Compra', 'Segunda via'],
            'tags:Tags setor nome 3': ['Dúvida', 'Compra', 'Segunda via'],
            'switch:Bloqueio por horário': false,
            'switch:Bloqueio para testes': true,
          },
        },
        {
          id: 'order_status',
          title: i18n.global.t('solutions.order_status.title'),
          description: i18n.global.t('solutions.order_status.description'),
          tip: i18n.global.t('solutions.order_status.tip'),
          globals: [
            'UUID do fluxo Template Message',
            'tags:Sellers liberados para consulta de status do pedido:',
            'switch:Habilitar Pix e boleto',
            'switch:Bloqueio para testes',
          ],
          mockedValues: {
            'UUID do fluxo Template Message':
              '550e8400-e29b-41d4-a716-446655440000',
            'tags:Sellers liberados para consulta de status do pedido:': [
              'Seller exemplo 01',
              'Seller exemplo 02',
              'Seller exemplo 03',
            ],
            'switch:Habilitar Pix e boleto': true,
            'switch:Bloqueio para testes': false,
          },
        },
        {
          id: 'recurring_purchase',
          title: i18n.global.t('solutions.recurring_purchase.title'),
          description: i18n.global.t(
            'solutions.recurring_purchase.description',
          ),
          tip: i18n.global.t('solutions.recurring_purchase.tip'),
          globals: [
            'VTEX API App Key MD',
            'VTEX API App Token MD',
            'Razão social',
            'Limite para lista de itens em recorrência',
            'switch:Cancelar compra recorrente',
            'switch:Pausar compra recorrente',
            'switch:Pular compra recorrente',
            'switch:Bloqueio para testes',
            'switch:Atendimento humano',
          ],
          mockedValues: {
            'VTEX API App Key MD':
              'md_api_token_2349f70c-20bf-4e5a-85e2-b5f671a12a3e',
            'VTEX API App Token MD':
              'md_app_key_abd923jd92349jsdnfk3487fndjf923ndfa',
            'Razão social': 'Empresa Exemplo S.A',
            'Limite para lista de itens em recorrência':
              '550e8400-e29b-41d4-a716-446655440000',
            'switch:Cancelar compra recorrente': false,
            'switch:Pausar compra recorrente': false,
            'switch:Pular compra recorrente': false,
            'switch:Bloqueio para testes': false,
            'switch:Atendimento humano': false,
          },
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
          tip: i18n.global.t('solutions.order_status_passive.tip'),
          globals: ['switch:Habilitar Pix e boleto'],
          mockedValues: {
            'switch:Habilitar Pix e boleto': true,
          },
        },
        {
          id: 'refer_and_win',
          title: i18n.global.t('solutions.refer_and_win.title'),
          description: i18n.global.t('solutions.refer_and_win.description'),
          tip: i18n.global.t('solutions.refer_and_win.tip'),
          globals: ['VTEX API App Key MD', 'VTEX API App Token MD'],
          mockedValues: {
            'VTEX API App Key MD':
              'md_api_token_2349f70c-20bf-4e5a-85e2-b5f671a12a3e',
            'VTEX API App Token MD':
              'md_app_key_abd923jd92349jsdnfk3487fndjf923ndfa',
          },
        },
      ];
    } else {
      return [];
    }
  },
};
