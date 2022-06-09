import { Injectable } from "@nestjs/common";
import * as dirTree from 'directory-tree';


@Injectable()
export class FileExplorerService {
    getFolderContent(directoryPath: string): any {
        const directoryContentAsJson = dirTree(
            directoryPath, {attributes: ['extension', 'size', 'type']}
        );
        return directoryContentAsJson;
    }
}