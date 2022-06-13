import { Injectable, NotFoundException } from "@nestjs/common";
import * as dirTree from 'directory-tree';
import * as fs from 'fs';



@Injectable()
export class FileExplorerService {
    getFolderContent(basePath: string, directory: string): any {
        const directoryPath = `${basePath}/${directory}`;
        const videosFormats = ['.MP4', '.AVI', '.FLV', '.MKV', '.WEBM', '.MOV', '.WMV'];
        const audiosFormats = ['.MP3', '.WAV', '.M3U'];
        const folders = [];
        const files = [];

        if (!fs.existsSync(basePath)) {
            return { folders, files };
        }

        if (!fs.existsSync(directoryPath)) {
            throw new NotFoundException('Directory does not exist');
        }

        const directoryContentAsJson = dirTree(
            directoryPath, {attributes: ['extension', 'size', 'type']}
        );

        directoryContentAsJson.children.forEach(file => {
            if (file.type === 'directory') {
                folders.push({
                    name: file.name,
                    path: file.path.replace(`${basePath}/`, ''),
                    size: file.size
                })
            }
            else {
                files.push({
                    name: file.name,
                    path: file.path.replace(`${basePath}/`, ''),
                    size: file.size,
                    isVideo: videosFormats.includes(file.extension.toUpperCase()),
                    isAudio: audiosFormats.includes(file.extension.toUpperCase())
                })
            }
        })

        return { files, folders };
    }
}