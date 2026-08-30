import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { IClassicHostUnlockHandle, unlockClassicHost, findClassicContentRoot } from '../../shared/host/classicHostUnlock';
import * as strings from 'PostEvent2023WebPartStrings';
import PostEvent2023 from './components/PostEvent2023';
import { IPostEvent2023Props } from './components/IPostEvent2023Props';

export interface IPostEvent2023WebPartProps {
  classicYear: string;
  icalBaseUrl: string;
}

function getDefaultIcalBaseUrl(webAbsoluteUrl: string): string {
  return `${webAbsoluteUrl.replace(/\/$/, '')}/SiteAssets/FFW2023`;
}

export default class PostEvent2023WebPart extends BaseClientSideWebPart<IPostEvent2023WebPartProps> {

  private _hostUnlock?: IClassicHostUnlockHandle;

  public render(): void {
    const element: React.ReactElement<IPostEvent2023Props> = React.createElement(
      PostEvent2023,
      {
        classicYear: this.properties.classicYear || '2023',
        classicPage: 'post-event.aspx',
        icalBaseUrl: this.properties.icalBaseUrl || getDefaultIcalBaseUrl(this.context.pageContext.web.absoluteUrl),
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
                PropertyPaneTextField('icalBaseUrl', {
                  label: strings.IcalBaseUrlFieldLabel,
                  description: strings.IcalBaseUrlFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
