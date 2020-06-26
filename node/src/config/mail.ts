interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'josef.butzke@zazuu.com.br',
      name: 'Josef da Zazuu',
    },
  },
} as IMailConfig;
