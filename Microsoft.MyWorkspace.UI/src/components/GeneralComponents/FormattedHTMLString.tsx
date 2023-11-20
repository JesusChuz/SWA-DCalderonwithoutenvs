import * as React from 'react';

interface IFormattedHTMLString {
  text: string;
}

export const FormattedHTMLString = (
  props: IFormattedHTMLString
): JSX.Element => {
  const textSplitAtNewline = React.useMemo(() => {
    if (props.text && props.text.length > 0) {
      const splitAtEnter = props.text.split('\n');
      return splitAtEnter;
    } else {
      return [];
    }
  }, [props.text]);

  return (
    <>
      {textSplitAtNewline.map((text, index) => {
        const numberLeadingWhiteSpace = text.search(/\S|$/);
        const leadingWhiteSpace = new Array(numberLeadingWhiteSpace).fill('');
        return (
          <React.Fragment key={`${text}${index}`}>
            {leadingWhiteSpace.map((w, i) => (
              <React.Fragment key={`${text}${i}`}>&nbsp;</React.Fragment>
            ))}
            {text}
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
};
