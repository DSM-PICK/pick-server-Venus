import { JoinColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { ClubLocation } from "./clubLocation";

@Entity()
export class Club {
  @PrimaryColumn({ length: 20 })
  name: string;

  @OneToOne((type) => ClubLocation, (clubLocation) => clubLocation.location)
  @JoinColumn({ name: "location" })
  clubLocation: ClubLocation;
}
