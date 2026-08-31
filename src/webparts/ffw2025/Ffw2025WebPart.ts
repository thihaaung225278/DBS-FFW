import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { IClassicHostUnlockHandle, unlockClassicHost, findClassicContentRoot } from '../../shared/host/classicHostUnlock';
import * as strings from 'Ffw2025WebPartStrings';
import Ffw2025 from './components/Ffw2025';
import { IFfw2025Props } from './components/IFfw2025Props';

export interface IFfw2025WebPartProps {
  classicYear: string;
  galleryViewMoreUrl: string;
}

const DEFAULT_GALLERY_VIEW_MORE =
  'https://dbs1bank.sharepoint.com/:f:/s/2024BankwideEngagement/Ep83rLvfn_5JsJqG1hAC67ABR2QDjrov6AN4z8lYKVqn7w?e=SOiRNp';

export default class Ffw2025WebPart extends BaseClientSideWebPart<IFfw2025WebPartProps> {

  private _hostUnlock?: IClassicHostUnlockHandle;

  public render(): void {
    const element: React.ReactElement<IFfw2025Props> = React.createElement(
      Ffw2025,
      {
        classicYear: this.properties.classicYear || '2025',
        classicPage: 'index.aspx',
        galleryViewMoreUrl: this.properties.galleryViewMoreUrl || DEFAULT_GALLERY_VIEW_MORE,
        onHostLayout: () => this._hostUnlock?.refresh()
      }
    );

    ReactDom.render(element, this.domElement);

    const contentRoot = findClassicContentRoot(this.domElement, 'ffw2025Root');

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
