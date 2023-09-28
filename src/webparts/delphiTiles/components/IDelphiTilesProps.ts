import { DisplayMode } from "@microsoft/sp-core-library";
import { ILink } from "../models/ILink";
import { TileSize } from "../models/enums";
export interface IDelphiTilesProps {
  webPartTitle: string;
  setWebpartTitle: (val: string) => void;
  links: ILink[];
  setLinks: (val: ILink[]) => void
  SelectedItemId: string,
  setSelectedItemId: (id: string) => void;
  displayMode: DisplayMode;
  size: TileSize,
  hideText: boolean;
}
