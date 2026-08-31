import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { IClassicHostUnlockHandle, unlockClassicHost, findClassicContentRoot } from '../../shared/host/classicHostUnlock';
import * as strings from 'Ffw2024WebPartStrings';
import Ffw2024 from './components/Ffw2024';
import { IFfw2024Props } from './components/IFfw2024Props';

export interface IFfw2024WebPartProps {
  classicYear: string;
  galleryViewMoreUrl: string;
}

const DEFAULT_GALLERY_VIEW_MORE =
  'https://dbs1bank.sharepoint.com/:f:/s/sghrcomms/Elz2YRsvNCpJvi-ma2r5cOsBJ4PwMFHkJeNjVcQixqPyRA?e=qL0bAJ';

export default class Ffw2024WebPart extends BaseClientSideWebPart<IFfw2024WebPartProps> {

  private _hostUnlock?: IClassicHostUnlockHandle;

  public render(): void {
    const element: React.ReactElement<IFfw2024Props> = React.createElement(
      Ffw2024,
      {
        classicYear: this.properties.classicYear || '2024',
        classicPage: 'index.aspx',
        galleryViewMoreUrl: this.properties.galleryViewMoreUrl || DEFAULT_GALLERY_VIEW_MORE,
        onHostLayout: () => this._hostUnlock?.refresh()
      }
    );

    ReactDom.render(element, this.domElement);

    const contentRoot = findClassicContentRoot(this.domElement, 'ffw2024Root');

    if (!this._hostUnlock) {
      this._hostUnlock = unlockClassicHost(this.domElement, contentRoot, {
        pageBackground: '#284055'
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
                PropertyPaneTextField('galleryViewMoreUrl', {
                  label: strings.GalleryViewMoreUrlFieldLabel,
                  description: strings.GalleryViewMoreUrlFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
