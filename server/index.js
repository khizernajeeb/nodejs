import './config/env';
import Server from './config/server';
import routes from './routes';

export default new Server()
  .router(routes)
  .listen(process.env.PORT);
