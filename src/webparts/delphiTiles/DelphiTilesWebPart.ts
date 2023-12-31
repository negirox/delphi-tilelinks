import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConditionalGroup,
  IPropertyPaneConfiguration,
  IPropertyPaneGroup,
  PropertyPaneButton,
  PropertyPaneChoiceGroup,
  //PropertyPaneLabel,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import DelphiTiles from './components/DelphiTiles';
import { IDelphiTilesProps } from './components/IDelphiTilesProps';
import { LayoutType, TileSize } from './models/enums';
import { ILink } from './models/ILink';
import { IPnPQuickLinksProps } from './components/IPnPQuickLinksProps';
import { PropertyFieldIconPicker } from '@pnp/spfx-property-controls/lib/PropertyFieldIconPicker';
export interface IDelphiTilesWebPartProps {
  webpartTitle: string;
  links: ILink[];
  type: LayoutType,
  tile: {
    size: TileSize,
    hideText: boolean
  }
}

export default class DelphiTilesWebPart extends BaseClientSideWebPart<IDelphiTilesWebPartProps> {
  private SelectedItemId: string = null;
  public render(): void {
    const SharedProps: IPnPQuickLinksProps = {
      webPartTitle: this.properties.webpartTitle,
      setWebpartTitle: (val: string) => { this.properties.webpartTitle = val },
      links: this.properties.links ?? [],
      setLinks: (val: ILink[]) => {
        this.properties.links = val;
        this.onPropertyPaneFieldChanged("links", null, val);
        this.render();
      },

      SelectedItemId: this.SelectedItemId,
      setSelectedItemId: (id: string) => {
        this.SelectedItemId = id;
        if (this.context.propertyPane.isPropertyPaneOpen()) {
          this.context.propertyPane.refresh();
        } else {
          this.context.propertyPane.open();
        }
        this.render();
      },

      displayMode: this.displayMode
    } as IPnPQuickLinksProps
    /*     const element: React.ReactElement<IDelphiTilesProps> = React.createElement(
          DelphiTiles,
          {
            size: TileSize.Medium,
            hideText: false
          }
        ); */
    let element: React.ReactElement<IPnPQuickLinksProps> = null;
    switch (this.properties.type) {
      case LayoutType.Tiles:
        element = React.createElement(DelphiTiles, { ...SharedProps, hideText: this.properties?.tile?.hideText ?? false, size: this.properties?.tile?.size ?? TileSize.Medium } as IDelphiTilesProps);
        break;

      //Feel free to contribute here and add the other layouts so we can eventually have every layout supported!
    }
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    if (this.SelectedItemId) {
      const index = this.properties.links.map(x => x.Id).indexOf(this.SelectedItemId);
      return {
        pages: [
          {
            header: {
              description: "Edit link"
            },
            groups: [
              {
                groupFields: [
                  PropertyPaneTextField(`links[${index}].Title`, {
                    label: "Title"
                  }),
                  PropertyPaneTextField(`links[${index}].Link`, {
                    label: "Url"
                  }),
                  PropertyFieldIconPicker(`links[${index}].IconName`,
                    {
                      key: `links[${index}].IconName`,
                      // eslint-disable-next-line no-return-assign
                      onSave: name => this.properties.links[index].IconName = name,
                      onPropertyChange: this.onPropertyPaneFieldChanged,
                      properties: this.properties,
                      label: "Icon",
                      buttonLabel: "Choose",
                      currentIcon: this.properties.links[index].IconName
                    }),
                  PropertyPaneChoiceGroup(`links[${index}].Target`, {
                    label: "Open",
                    options: [
                      { key: "_self", text: "In this tab" },
                      { key: "_blank", text: "In new tab" }
                    ]
                  }),
                  PropertyPaneTextField(`links[${index}].BackgroundColor`, {
                    label: "BackGround Color"
                  }),
                  PropertyPaneTextField(`links[${index}].IconColor`, {
                    label: "Text & Icon Color" 
                  }),
                  PropertyPaneTextField(`links[${index}].HoverColor`, {
                    label: "Hover Color" 
                  }),
                  PropertyPaneButton('', {
                    text: "Delete",
                    icon: "Delete",
                    onClick: () => {
                      this.properties.links = this.properties.links.filter(x => x.Id !== this.SelectedItemId);
                      this.onPropertyPaneFieldChanged("links", null, this.properties.links);
                      this.SelectedItemId = null;
                      this.context.propertyPane.refresh();
                      this.render();
                    }
                  }),
                  PropertyPaneButton('', {
                    text: "Close",
                    onClick: () => {
                      this.SelectedItemId = null;
                      this.context.propertyPane.refresh();
                      this.render();
                    }
                  })
                ]
              }
            ]
          }
        ]
      }
    }


    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Layout options",
              groupFields: [
                PropertyPaneChoiceGroup("type", {
                  options: [
                    /*                     { key: LayoutType.Compact, text: "Compact", iconProps: { officeFabricIconFontName: "BacklogList" }, disabled: false },
                                        { key: LayoutType.FilmStrip, text: "FilmStrip", iconProps: { officeFabricIconFontName: "AspectRatio" }, disabled: false },
                                        { key: LayoutType.Grid, text: "Grid", iconProps: { officeFabricIconFontName: "GridViewSmall" }, disabled: false },
                                        { key: LayoutType.Button, text: "Button", iconProps: { officeFabricIconFontName: "Calculator" }, disabled: false },
                                        { key: LayoutType.List, text: "List", iconProps: { officeFabricIconFontName: "List" }, disabled: false }, */
                    { key: LayoutType.Tiles, text: "Tiles", iconProps: { officeFabricIconFontName: "PictureTile" } }
                  ]
                }),
              ]
            },
            ...(this.properties.type === LayoutType.Tiles ? this.TileLayoutFields() : []),
            /* {
              groupName: "Filter",
              groupFields: [
                PropertyPaneToggle("_", {
                  label: "Enable audience targeting",
                  disabled: true,
                }),
                PropertyPaneLabel('', {
                  text: "Audience targeting is not yet implemented, feel free to do so"
                })
              ]
            } */
          ]
        }
      ]
    };
  }


  private TileLayoutFields(): (IPropertyPaneGroup | IPropertyPaneConditionalGroup)[] {
    return [{
      groupFields: [
        PropertyPaneChoiceGroup('tile.size', {
          label: "Icon size",
          options: [
            { key: TileSize.Small, text: "Small" },
            { key: TileSize.Medium, text: "Medium" },
            { key: TileSize.Large, text: "Large" },
            { key: TileSize.XLarge, text: "Extra large" },
            { key: TileSize.FillSpace, text: "Fill space" },
          ]
        }),
        PropertyPaneToggle("tile.hideText", {
          label: "Show only icon",
          disabled: this.properties.tile.size > TileSize.Large,
        })
      ]
    }]
  }
}

