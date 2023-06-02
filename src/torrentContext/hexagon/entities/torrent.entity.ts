import { User } from '../../../authContext/hexagon/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TorrentStatus } from '../torrent-status.enum';

@Entity({ name: 'torrents' })
export class Torrent {
  constructor(user: User, path: string, torrentName: string) {
    this.user = user;
    this.progression = 0;
    this.torrentName = torrentName;
    this.status = TorrentStatus.QUEUED;
    this.path = path;
  }

  startTorrent(): Torrent {
    this.progression = 0;
    this.status = TorrentStatus.STARTED;
    return this;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({ name: 'torrent_name' })
  torrentName: string;

  @Column({
    type: 'set',
    enum: TorrentStatus,
  })
  status: TorrentStatus;

  @Column({ default: 0 })
  progression: number;

  @ManyToOne((type) => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
