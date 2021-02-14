import fs from 'fs';
import _sizeOf from 'image-size';
import path from 'path';
import { promisify } from 'util';

import { FileModuleResolversType } from '..';

const sizeOf = promisify(_sizeOf);

const resolvers: FileModuleResolversType = {
	Query: {
		images: async () => {
			const files = fs.readdirSync(path.join(__dirname, '../../../../static/images'));
			console.log(files);
			const images = [];
			for (const file of files) {
				try {
					const dimensions = await sizeOf(path.join(__dirname, '../../../../static/images', file));
					if (dimensions && dimensions.width && dimensions.height) {
						images.push({
							path: '/static/images/' + file,
							width: dimensions.width,
							height: dimensions.height,
						});
					}
				} catch (err) {
					// not an image, ignore it
				}
			}
			return images;
		},
	},
};

export default resolvers;
