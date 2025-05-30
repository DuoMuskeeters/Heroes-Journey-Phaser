import { type Canlı } from "./Karakter";

type HP = number;

export enum SpellRange {
  Single,
  Multiple,
  SingleORNone,
}

export type ExtractSpell<
  Type,
  Range extends SpellRange
> = Range extends SpellRange.Single
  ? Type
  : Range extends SpellRange.Multiple
  ? Type[]
  : Range extends SpellRange.SingleORNone
  ? Type | undefined
  : never;

export type SpellDamage<R extends SpellRange> = NonNullable<ExtractSpell<number, R>>;

type SpellOptions<R extends SpellRange> = {
  damage: (canlı: ExtractSpell<Canlı, R>) => SpellDamage<R>;
  hit: (
    canlı: ExtractSpell<Canlı, R>,
    damage: SpellDamage<R>
  ) => ExtractSpell<HP, R>;
  has?: () => boolean;
  onUse?: () => void;
  cancelable?: boolean;
};

export class Spell<R extends SpellRange> {
  damage: SpellOptions<R>["damage"];
  hit: (canlı: ExtractSpell<Canlı, R>) => ExtractSpell<HP, R>;
  has: NonNullable<SpellOptions<R>["has"]>;
  onUse: NonNullable<SpellOptions<R>["onUse"]>;
  cancelable: boolean;

  constructor(type: "basic", rangeType: R, options: SpellOptions<R>);
  constructor(
    type: "heavy",
    rangeType: R,
    options: SpellOptions<R> & {
      has: () => boolean;
    }
  );

  constructor(
    public type: "basic" | "heavy",
    public rangeType: R,
    options: SpellOptions<R>
  ) {
    this.damage = options.damage;
    this.hit = (canlı: ExtractSpell<Canlı, R>) => {
      if (!this.has() && !this.onUse)
        throw new Error(`${type} attack için gerekli koşullar sağlanmadı.`);

      const damage = this.damage(canlı);
      return options.hit(canlı, damage);
    };
    this.has = options.has ?? (() => true);
    this.onUse = options.onUse ?? (() => ({}));
    this.cancelable = options.cancelable ?? false;
  }
}

type PassiveOptions<Data> = {
  has: () => boolean;
  view: () => Data;
  do: (data: Data) => void;
};

export class Passive<Data> {
  has: PassiveOptions<Data>["has"];
  view: PassiveOptions<Data>["view"];
  do: () => void;

  constructor(options: PassiveOptions<Data>) {
    this.has = options.has;
    this.view = options.view;
    this.do = () => {
      const has = this.has();
      if (!has) throw new Error("Passive için gerekli koşullar sağlanmadı.");
      const view = this.view();
      return options.do(view);
    };
  }
}
