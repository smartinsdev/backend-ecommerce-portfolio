export abstract class ValueObject<Props extends Record<string, unknown>> {
  protected readonly props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  equals(vo?: ValueObject<Props> | null): boolean {
    if (vo === null || vo === undefined) return false;
    const own = Object.keys(this.props);
    const other = Object.keys(vo.props);

    if (own.length !== other.length) return false;
    return own.every(key => Object.is(this.props[key], vo.props[key]));
  }
}
