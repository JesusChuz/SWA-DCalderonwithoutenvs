import * as React from 'react';
import { Nav, INavLinkGroup, INavLink } from '@fluentui/react/lib/Nav';
import { useSelector } from 'react-redux';
import { getHyperlinks, getTours } from '../../store/selectors';
import { TourDto } from '../../types/Catalog/TourDto.types';
import { HyperlinkDto } from '../../types/Catalog/HyperlinkDto.types';

interface IProps {
  showingGuides: boolean;
  currentGuide: number;
  setShowingGuides: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentGuide: React.Dispatch<React.SetStateAction<number>>;
}

const Links = (props: IProps): JSX.Element => {
  const hyperlinkList: HyperlinkDto[] = useSelector(getHyperlinks);
  const wikiLink = hyperlinkList.find((element) => {
    return element.Name === 'wikiLink';
  }).Url;
  const teamsLink = hyperlinkList.find((element) => {
    return element.Name === 'teamsLink';
  }).Url;
  const ticketLink = hyperlinkList.find((element) => {
    return element.Name === 'ticketLink';
  }).Url;
  const faqLink = hyperlinkList.find((element) => {
    return element.Name === 'faqLink';
  }).Url;
  const featureRequestLink = hyperlinkList.find((element) => {
    return element.Name === 'featureRequestLink';
  }).Url;
  const sharepointLink = hyperlinkList.find((element) => {
    return element.Name === 'sharepointLink';
  }).Url;
  const enghubLink = hyperlinkList.find((element) => {
    return element.Name === 'enghubLink';
  }).Url;
  const userGuideList: TourDto[] = useSelector(getTours).slice(1);
  const userGuideLinks: INavLink[] = React.useMemo(() => {
    return userGuideList.map((userGuide, index) => {
      return {
        name: userGuide.Title,
        url: '/#',
        key: 'key' + (index + 6).toString(),
        onClick: (ev) => {
          ev.preventDefault();
          props.setCurrentGuide(index);
          props.setShowingGuides(true);
        },
      };
    });
  }, [userGuideList]);
  const navLinkGroups: INavLinkGroup[] = [
    {
      name: 'User Guides',
      links: [
        {
          name: 'Documentation Home',
          url: '/#',
          key: 'key0',
          target: '_blank',
          onClick: (ev: { preventDefault: () => void }) => {
            ev.preventDefault();
            props.setShowingGuides(false);
          },
        },
        ...userGuideLinks,
      ],
    },
    {
      name: 'Get Help',
      links: [
        {
          name: 'Wiki',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'wiki',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(wikiLink, '_blank');
          },
        },
        {
          name: 'Teams Community',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'teamscommunity',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(teamsLink, '_blank');
          },
        },
        {
          name: 'Create a Ticket',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'ticket',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(ticketLink, '_blank');
          },
        },
        {
          name: 'FAQ',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'faq',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(faqLink, '_blank');
          },
        },
      ],
    },

    {
      name: 'Feedback',
      links: [
        {
          name: 'Request a Feature',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'feature',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(featureRequestLink, '_blank');
          },
        },
      ],
    },
    {
      name: 'Additional Resources',
      links: [
        {
          name: 'MyWorkspace SharePoint',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'sharepoint',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(sharepointLink, '_blank');
          },
        },
        {
          name: 'Engineering Hub',
          icon: 'NavigateExternalInline',
          url: '/#',
          key: 'enghub',
          target: '_blank',
          onClick: (ev) => {
            ev.preventDefault();
            window.open(enghubLink, '_blank');
          },
        },
      ],
    },
  ];
  return (
    <Nav
      onRenderGroupHeader={_onRenderGroupHeader}
      ariaLabel='Nav example with custom group headers'
      groups={navLinkGroups}
    />
  );
};

function _onRenderGroupHeader(group: INavLinkGroup): JSX.Element {
  return <h3>{group.name}</h3>;
}

export default Links;
