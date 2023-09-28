import * as React from 'react';
import styles from './DelphiTiles.module.scss';
import { IDelphiTilesProps } from './IDelphiTilesProps';
import { TilesQuickLinks } from './TilesQuickLinks';
//import { ILink } from '../models/ILink';
export default class DelphiTiles extends React.Component<IDelphiTilesProps, {}> {
  //private links: ILink[];
  constructor(props: IDelphiTilesProps) {
    super(props);
   /*  this.links = [{
      Id: "1",
      Title: "Default",
      IconName: "home",
      Link: "google",
      SortWeight: 0,
      Target: "www.google.com"
    }]; */
  }
  public render(): React.ReactElement<IDelphiTilesProps> {
    return (
      <section className={styles.delphiTiles}>
        <TilesQuickLinks
          links={this.props.links} displayMode={this.props.displayMode} webPartTitle={this.props.webPartTitle}
          setSelectedItemId={this.props.setSelectedItemId} SelectedItemId={this.props.SelectedItemId}
          setLinks={this.props.setLinks} setWebpartTitle={this.props.setWebpartTitle}
          hideText={this.props.hideText} size={this.props.size}
        ></TilesQuickLinks>
      </section>
    );
  }
}
