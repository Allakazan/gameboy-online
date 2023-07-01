import { TextureLoader } from 'three';

const sources = {
    cloudinary: 'https://res.cloudinary.com/dnv6e2zkh/image/upload/',
    igdb: 'https://images.igdb.com/igdb/image/upload/t_720p/'
};

const GetThumbnail = async (url, source = 'cloudinary') => {
    const texture = await new TextureLoader().loadAsync(sources[source] + url);

    /*var imageAspect = texture.image.width / texture.image.height;

    if (source === 'igdb') {
        texture.matrixAutoUpdate = false;
        texture.matrix.setUvTransform( 0, (imageAspect - 1) / 2, imageAspect - 1, 1, 0, 0.5, 0.5 );
    }*/
    
    return texture;
}

export {GetThumbnail};