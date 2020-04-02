import examplesRouter from './core/modules/example/routes';

export default function routes(app) {
  app.use('/example', examplesRouter);
}
