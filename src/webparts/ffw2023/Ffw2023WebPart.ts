import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { IClassicHostUnlockHandle, unlockClassicHost, findClassicContentRoot } from '../../shared/host/classicHostUnlock';
import * as strings from 'Ffw2023WebPartStrings';
import Ffw2023 from './components/Ffw2023';
import { IFfw2023Props } from './components/IFfw2023Props';

export interface IFfw2023WebPartProps {
  classicYear: string;
  galleryDownloadUrl: string;
}

const DEFAULT_GALLERY_DOWNLOAD =
  'https://dbs1bank.sharepoint.com/:f:/s/FutureForwardWeek2023/EunJzHpJQoJMmFO0zJrc7wsBcEj1uk5vuClAASC3MkW7Mg?e=YA2iFa';

export default class Ffw2023WebPart extends BaseClientSideWebPart<IFfw2023WebPartProps> {

  private _hostUnlock?: IClassicHostUnlockHandle;

  public render(): void {
    const element: React.ReactElement<IFfw2023Props> = React.createElement(
      Ffw2023,
      {
        classicYear: this.properties.classicYear || '2023',
        classicPage: 'index.aspx',
        galleryDownloadUrl: this.properties.galleryDownloadUrl || DEFAULT_GALLERY_DOWNLOAD,
        onHostLayout: () => this._hostUnlock?.refresh()
      }
    );

    ReactDom.render(element, this.domElement);

    const contentRoot = findClassicContentRoot(this.domElement, 'ffw2023Root');

    if (!this._hostUnlock) {
      this._hostUnlock = unlockClassicHost(this.domElement, contentRoot, {
        pageBackground: '#FFE5D4'
      });
    } else {
      this._hostUnlock.refresh();
    }

    this.scheduleHostRefresh();
  }

  private scheduleHostRefresh(): void {
    window.setTimeout(() => this._hostUnlock?.refresh(), 0);
    window.setTimeout(() => this._hostUnlock?.refresh(), 500);
  }

  protected onDispose(): void {
    this._hostUnlock?.dispose();
    this._hostUnlock = undefined;
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('classicYear', {
                  label: strings.ClassicYearFieldLabel
                }),
                PropertyPaneTextField('galleryDownloadUrl', {
                  label: strings.GalleryDownloadUrlFieldLabel,
                  description: strings.GalleryDownloadUrlFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
