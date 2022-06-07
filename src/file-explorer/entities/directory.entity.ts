import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'directories'})
export class Directory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({default: true, name: 'is_directory'})
    isDirectory: boolean

    @ManyToOne(type => Directory)
    @JoinColumn({name: 'parent_directory_id'})
    parentDirectory: Directory

    @Column()
    size: number;

    @Column({name: 'is_video', default: false})
    isVideo: boolean;

    @Column({name: 'is_audio', default: false})
    isAudio: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}