import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TorrentStatus } from "../torrent-status.enum";

@Entity({name: 'torrents'})
export class Torrent {
    constructor(user: User, path: string) {
        this.user = user;
        this.progression = 0;
        this.status = TorrentStatus.QUEING;
        this.path = path;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column({
        type: 'set',
        enum: TorrentStatus
    })
    status: TorrentStatus

    @Column({default: 0})
    progression: number;

    @ManyToOne(type => User)
    @JoinColumn({
        name: 'user_id'
    })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}