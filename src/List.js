import React from "react";

const style = {
  position: "absolute",
  left: 0,
  right: 0
};
class MyVirtualizedList extends React.Component {
  constructor(props) {
    super();
    this.handleScroll = this.handleScroll.bind(this);
    this.computeHeight = this.computeHeight.bind(this);
    this.getOffset = this.getOffset.bind(this);
    this.findRange = this.findRange.bind(this);
    this.getHeightAndOffset = this.getHeightAndOffset.bind(this);
    this.binarySearch = this.binarySearch.bind(this);
    this.state = {
      scrollTop: 0
    };
    this.cache = {
      lastIndex: 0,
      lastOffset: 0,
      data: {
        "0": {
          offset: 0,
          height: props.rowHeight(0)
        }
      }
    };
  }
  binarySearch(target) {
    let low = 0;
    let high = this.cache.lastIndex;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const { offset } = this.cache.data[middle];
      if (target === offset) {
        return middle;
      } else if (target > offset) {
        low = middle;
      } else {
        high = middle - 1;
      }
    }
    return low;
  }
  getOffset(index) {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.props.rowHeight(i);
    }
    return offset;
  }
  getHeightAndOffset(index) {
    if (index > this.cache.lastIndex) {
      let offset = this.cache.lastOffset;
      for (let i = this.cache.lastIndex + 1; i <= index; i++) {
        const height = this.props.rowHeight(i - 1);
        offset += height;
        this.cache.data[i] = {
          height: this.props.rowHeight(i),
          offset
        };
      }
      this.cache.lastIndex = index;
      this.cache.lastOffset = offset;
    }
    return this.cache.data[index];
  }
  computeHeight() {
    return this.props.items.reduce((result, item, i) => {
      return result + this.props.rowHeight(i);
    }, 0);
  }
  handleScroll(event) {
    this.setState({
      scrollTop: event.target.scrollTop
    });
  }
  findRange(scrollTop) {
    const range = [];
    console.log(this.cache.lastOffset);
    // if (scrollTop > this.cache.lastOffset) {
    // const start = this.binarySearch(scrollTop);
    // console.log(`-------`);
    // console.log(start);
    //   let { offset } = this.cache.data[start];
    //   for (let i = start; i < this.props.items.length; i++) {
    //     const { height } = this.cache.data[i];
    //     offset += height;
    //     if (offset > scrollTop + this.props.height) {
    //       return [start, i];
    //     }
    //   }
    // } else {
    for (let i = 0; i < this.props.items.length; i++) {
      const { offset } = this.getHeightAndOffset(i);
      if (offset >= scrollTop && range.length === 0) {
        range.push(i);
      }
      if (offset > scrollTop + this.props.height) {
        range.push(i);
        return range;
      }
    }
    // }
  }
  render() {
    const [startIndex, endIndex] = this.findRange(this.state.scrollTop);
    return (
      <div
        style={{
          position: "relative",
          overflow: "auto",
          height: this.props.height
        }}
        onScroll={this.handleScroll}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            height: this.computeHeight()
          }}
        />
        {this.props.items.slice(startIndex, endIndex).map((item, index) => {
          return this.props.children({
            item,
            style: {
              ...style,
              height: this.props.rowHeight(startIndex + index),
              top: this.getOffset(startIndex + index)
            }
          });
        })}
      </div>
    );
  }
}

export default MyVirtualizedList;
