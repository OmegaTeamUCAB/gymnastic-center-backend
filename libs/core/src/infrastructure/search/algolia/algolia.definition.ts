import { ConfigurableModuleBuilder } from '@nestjs/common';

export type AlgoliaOptions = {
  id: string;
  key: string;
  retryAttempts?: number;
  retryDelay?: number;
};

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: SURREAL_MODULE_OPTIONS,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<AlgoliaOptions>(/* { alwaysTransient: true } */)
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
