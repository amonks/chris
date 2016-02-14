// stolen from https://gist.github.com/netgusto/f9866c8abff3672406d4

Content = (DocType / Comment / BalancedTag / SelfClosingTag / Text)*


DocType = "<!doctype " doctype:[^>]* ">" {
    return {
        type: 'DocType',
        content: doctype.join('')
    };
}

Comment = "<!--" c:(!"-->" c:. {return c})* "-->" {
    return {
        type: 'Comment',
        content: c.join('')
    };
}

BalancedTag = startTag:StartTag content:Content endTag:EndTag {
    if (startTag.name != endTag) {
        throw new Error("Expected </" + startTag.name + "> but </" + endTag + "> found.");
    }

    return {
      type: 'BalancedTag',
      name: startTag.name,
      attributes: startTag.attributes,
      content: content
    };
  }

SelfClosingTag = "<" name:TagName attributes:Attributes* "/>" {
    return {
      type: 'SelfClosingTag',
      name: name,
      attributes: attributes
    };
  }

StartTag = "<" name:TagName attributes:Attributes* ">" {
  return {
    name: name,
    attributes: attributes
  }
}

EndTag = "</" name:TagName ">" { return name; }

Attributes = " " attributes:Attribute* { return attributes; }

Attribute = (ValuedAttribute / ValuelessAttribute)

ValuedAttribute = name:AttributeName "=" value:AttributeValue {
  return {
    name: name,
    value: value
  };
}

ValuelessAttribute = name:AttributeName {
  return {
    name: name,
    value: null
  };
}

AttributeName = chars:[a-zA-Z0-9\-]+ { return chars.join(""); }
AttributeValue = (QuotedAttributeValue / JavascriptAttributeValue / UnquotedAttributeValue)

JavascriptAttributeValue = value:JavascriptString { return value; }

QuotedAttributeValue = value:QuotedString { return value; }

UnquotedAttributeValue = value:decimalDigit* { return value.join(''); }

TagName = chars:[a-zA-Z0-9]+ { return chars.join(""); }

Text = chars:[^<]+  {
  return {
    type: 'Text',
    content: chars.join("")
  }
}



decimalDigit = [0-9]

JavascriptString
  = "{{" val:(!"}}" .)* "}}"
  { return val.map((ar) => {return ar[1]})
              .join("")}

QuotedString = quoteStart:('"'/"'") chars:[a-zA-Z0-9://\.-]+ quoteEnd:('"'/"'") {
  if (quoteStart != quoteEnd) {
    throw new Error("Unmatched quote; Expected " + quoteStart + " but " + quoteEnd + " found.");
  }
  return chars.join("");
}


