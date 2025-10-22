declare module 'qrcode';
declare module 'multer';

import 'express';
declare module 'express-serve-static-core' {
	interface Request {
		files?: any;
	}
}
