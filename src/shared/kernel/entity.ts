import { UniqueEntityId } from "./unique-entity-id.js";

export abstract class Entity<Props> {
  private readonly _id: UniqueEntityId;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  get id() {
    return this._id;
  }

  equals(entity: Entity<unknown>): boolean {
    if (entity === this) return true;
    return entity.id.equals(this._id);
  }
}
