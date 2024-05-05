import { ConfigurableModuleBuilder } from '@nestjs/common';

export type MailgunOptions = {
  key: string;
  retryAttempts?: number;
};

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: MAILGUN_MODULE_OPTIONS,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<MailgunOptions>(/* { alwaysTransient: true } */)
  .setClassMethodName('forRoot')
  // .setFactoryMethodName('resolve')
  .setExtras<{ isGlobal?: boolean }>(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
