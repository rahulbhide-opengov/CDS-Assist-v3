# CDS Figma Library Catalog — Complete Component Reference

**Auto-generated from live Figma files.** Use this as the single source of truth for all component keys.

## Library Architecture

| Library | File Key | Role | Components |
|---------|----------|------|------------|
| **CDS 37** (core) | `MxdeZ8e13qSmlenBVMmzzI` | Core components, tokens, styles | 113 component sets |
| **CDS 37 Patterns** | `ovXZlZTFwlNBTISlap4s4p` | Page-level patterns & layouts | 29 component sets |
| **CDS 37 Icons** | `xaElUstGXrXTsCRKp2IOhF` | Icons, illustrations, logos | 7 component sets + 567 icons |
| **Agents** | `x2US3gmKKjSeby3troKJRa` | Product file (consumes above) | No published components |

## Import Methods

```javascript
// METHOD 1: Import a specific variant by its component key
const comp = await figma.importComponentByKeyAsync(variantKey);
const inst = comp.createInstance();

// METHOD 2: Import a component set, then use defaultVariant
const compSet = await figma.importComponentSetByKeyAsync(setKey);
const inst = compSet.defaultVariant.createInstance();

// CRITICAL: Never use importComponentByKeyAsync with a setKey — it hangs!
// Always warm up the library first by importing Chip or Button.
```

---

## CDS 37 — Core Components

### Accordion

#### `Accordion`
- **Set Key**: `e6b75db35ef4023fb02796f7c9230d8c92628307`
- **Default Variant Key**: `b3538abf3dd88a410b619c9fb4d7395612a1adc8`
- **Variants**: 48
- **Properties**:
  - `Selected#10427:0` (BOOLEAN) [default: false]
  - `Description#10431:13` (BOOLEAN) [default: true]
  - `With Icon#10431:39` (BOOLEAN) [default: true]
  - `Icon#10431:65` (INSTANCE_SWAP) [default: 18466:8371]
  - `State` (VARIANT) — options: Idle, Disabled, Hover, Focus [default: Idle]
  - `Size` (VARIANT) — options: Medium (Default), Small, Large [default: Medium (Default)]
  - `Alignment` (VARIANT) — options: Left, Right [default: Left]
  - `Open` (VARIANT) — options: False, True [default: False]

### Alert

#### `<Alert>`
- **Set Key**: `92e7c4355c76676b1a0a5c6846ab2127b302cd1f`
- **Default Variant Key**: `e38a29d0fc54be4279ec534e42218bf4f876ed22`
- **Variants**: 8
- **Properties**:
  - `On Close?#9972:0` (BOOLEAN) [default: false]
  - `Action?#9974:202` (BOOLEAN) [default: false]
  - `↳Instance#9989:0` (INSTANCE_SWAP) [default: 7426:48547]
  - `Description?#9989:17` (BOOLEAN) [default: true]
  - `Title?#9989:26` (BOOLEAN) [default: true]
  - `↳ Title#11069:1763` (TEXT) [default: {Title}]
  - `↳ Description#11069:1772` (TEXT) [default: {Description}]
  - `Severity` (VARIANT) — options: Error, Warning, Info, Success [default: Error]
  - `Variant` (VARIANT) — options: Filled, Outlined [default: Filled]

### Avatar

#### `<Avatar>`
- **Set Key**: `c9c9f3b6696ec2ebd374635f6e1d2562eff03fdc`
- **Default Variant Key**: `7d41714cdff8c297733a75a28f84c513abcb2966`
- **Variants**: 36
- **Properties**:
  - `Badge#9899:0` (BOOLEAN) [default: false]
  - `Initials#10264:0` (TEXT) [default: OP]
  - `Size` (VARIANT) — options: 40px, 32px, 24px, 18px [default: 40px]
  - `Variant` (VARIANT) — options: Circular, Rounded, Square [default: Circular]
  - `Content` (VARIANT) — options: Text, Icon, Image [default: Text]

#### `<Avatar>`
- **Set Key**: `cd7f49d2917c78d0112ae0f3c096fab1c632473f`
- **Default Variant Key**: `388cfd6d2c251258f7e3bedf1851aa126b5e0d34`
- **Variants**: 16
- **Properties**:
  - `Badge#9899:0` (BOOLEAN) [default: false]
  - `Initials#10264:0` (TEXT) [default: OP]
  - `Size` (VARIANT) — options: 40px, 32px, 24px, 18px [default: 40px]
  - `Variant` (VARIANT) — options: Circular, Rounded [default: Circular]
  - `Content` (VARIANT) — options: Text, Icon, Image [default: Text]

#### `<AvatarGroup>`
- **Set Key**: `ff18e5ce1646079d88df4cf22e4a4c98ca706859`
- **Default Variant Key**: `f605c39b7c9288a1495754e5a0448a041a8979a8`
- **Variants**: 36
- **Properties**:
  - `Spacing` (VARIANT) — options: Medium, Small, Number [default: Medium]
  - `Max` (VARIANT) — options: 2, 3, 4, 5 [default: 2]
  - `Size` (VARIANT) — options: 40px, 32px, 24px [default: 40px]

### Badge

#### `<Badge>`
- **Set Key**: `a7428675006ca2e178b21eff400da1dfa28b9505`
- **Default Variant Key**: `737dc4cd7de7c65226cd092b1f21076d7ed2ca80`
- **Variants**: 13
- **Properties**:
  - `Content#11069:1468` (TEXT) [default: 1]
  - `Variant` (VARIANT) — options: Standard, Dot [default: Standard]
  - `Color` (VARIANT) — options: Default, Primary, Secondary, Error, Warning, Info, Success [default: Default]

#### `<Badge> | With Instance `
- **Set Key**: `3b452f9613112356b0260ecd89f43524f1e8b589`
- **Default Variant Key**: `4c445e65e1354fa578894a0b6ee20ddecf656644`
- **Variants**: 13
- **Properties**:
  - `Component#10036:0` (INSTANCE_SWAP) [default: 7497:50687]
  - `Variant` (VARIANT) — options: Standard, Dot [default: Standard]
  - `Color` (VARIANT) — options: Default, Primary, Secondary, Error, Warning, Info, Success [default: Default]

### Bottom Navigation

#### `<BottomNavigationAction>`
- **Set Key**: `ffd0fa89e21861dc614e76d899c3874c6c033f01`
- **Default Variant Key**: `71a38d4763f9b96d17d92d262b22081647884ee2`
- **Variants**: 14
- **Properties**:
  - `Label Content#11073:1830` (TEXT) [default: Label]
  - `Active` (VARIANT) — options: False, True [default: False]
  - `Label` (VARIANT) — options: True, False [default: True]
  - `State` (VARIANT) — options: Enabled, Focused, Disabled, Pressed [default: Enabled]

#### `<BottomNavigation>`
- **Set Key**: `228dd9a3fcbbb9e690bd384780cbbd8d19f8b6d5`
- **Default Variant Key**: `368281d06ee3a1fd59610476e5c98a1fc265a41d`
- **Variants**: 4
- **Properties**:
  - `Icon Only` (VARIANT) — options: False, True [default: False]
  - `Items` (VARIANT) — options: Three, Four [default: Three]

### Breadcrumbs

#### `<Breadcrumbs>`
- **Set Key**: `84b669e3ff9efd869c1d2600879d0e9ebb2ae118`
- **Default Variant Key**: `0975060a366a28cbce3d3bcff73b123c0aade50c`
- **Variants**: 4
- **Properties**:
  - `Icon#10028:17` (BOOLEAN) [default: true]
  - `Separator Icon#10120:169` (INSTANCE_SWAP) [default: 7475:54246]
  - `Separator` (VARIANT) — options: Text*, Icon [default: Text*]
  - `Collapsed` (VARIANT) — options: False, True [default: False]

### Button

#### `Button`
- **Set Key**: `568797e855cac927de48dcf4bfb4682db7321def`
- **Default Variant Key**: `55efd1bad246063d611f64b3ba500504a7143cb5`
- **Variants**: 63
- **Properties**:
  - `Text#6851:0` (TEXT) [default: Action]
  - `Show label#6851:141` (BOOLEAN) [default: true]
  - `Left icon?#6851:282` (BOOLEAN) [default: false]
  - `Right icon?#7121:0` (BOOLEAN) [default: false]
  - `Focus ring#12045:0` (BOOLEAN) [default: false]
  - `State` (VARIANT) — options: Idle, Selected/ Hover/ Pressed, Disabled [default: Idle]
  - `Type` (VARIANT) — options: Primary, Secondary, Secondary-alt, Tertiary, Tertiary-alt, Destructive, Destructive-alt [default: Primary]
  - `Size` (VARIANT) — options: Medium (Default), Small, Large [default: Medium (Default)]

### Button Group

#### `ButtonGroup`
- **Set Key**: `56fc25db145b45ae76398b0bc3cdd05c32731f13`
- **Default Variant Key**: `bcfb7c1f28f3da5d3b0dd14d2de1a2ca60a5e4ea`
- **Variants**: 42
- **Properties**:
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]
  - `Variant` (VARIANT) — options: Contained, Text, Outlined [default: Contained]
  - `Color` (VARIANT) — options: Primary, Secondary, Error, Warning, Info, Success, Inherit [default: Primary]

### Card

#### `<CardHeader>`
- **Set Key**: `1b5cfcfe6c1f4afaaf53e8a34f8ca4f3490943e0`
- **Default Variant Key**: `9d9b943e06081d9f77a4467c991fbfdf5444a025`
- **Variants**: 2
- **Properties**:
  - `Subheader?#10028:49` (BOOLEAN) [default: false]
  - `Right Action?#10028:66` (BOOLEAN) [default: false]
  - `↳ Instance#10975:0` (INSTANCE_SWAP) [default: 7497:50687]
  - `Header#11073:1820` (TEXT) [default: {Header}]
  - `↳ Value#11073:1825` (TEXT) [default: {Subheader}]
  - `Avatar` (VARIANT) — options: False, True [default: False]

#### `<CardActions>`
- **Set Key**: `767062b8a278048294a3f9e56924f078796d9a29`
- **Default Variant Key**: `f1949b35586a107e66ee3e792f962ba03cb556a5`
- **Variants**: 1
- **Properties**:
  - `Action #1#14884:0` (INSTANCE_SWAP) [default: 10020:110248]
  - `Action #2#14884:1` (INSTANCE_SWAP) [default: 10020:110248]
  - `Action #3#14884:2` (INSTANCE_SWAP) [default: 10020:110248]
  - `↳ Action 1#14884:3` (BOOLEAN) [default: true]
  - `↳ Action 2#14884:4` (BOOLEAN) [default: false]
  - `↳ Action 3#14884:5` (BOOLEAN) [default: true]
  - `Show Destructive Button#14884:6` (BOOLEAN) [default: false]
  - `Property 1` (VARIANT) — options: Default [default: Default]

#### `<CardMedia>`
- **Set Key**: `4ff69a8296469dc8529569c8bfaf5e60dc331128`
- **Default Variant Key**: `be0dd0739e809dbbedbf20598eb0af50ab98e1fd`
- **Variants**: 2
- **Properties**:
  - `↳ Instance#11480:1095` (INSTANCE_SWAP) [default: 9447:95707]
  - `Ratio` (VARIANT) — options: 4x3, 1:9 [default: 4x3]

#### `<Card>`
- **Set Key**: `6c3442350d8e8be5c7f6802eb755a06365aa7c13`
- **Default Variant Key**: `3375020c5bbbc60dd08b8ab49a62909eba45304a`
- **Variants**: 4
- **Properties**:
  - `Small Screen` (VARIANT) — options: False, True [default: False]
  - `Blank` (VARIANT) — options: False, True [default: False]

### Charts

#### `Elements / Bars`
- **Set Key**: `b21914af562c052162772e8a4d56b3446849b31e`
- **Default Variant Key**: `16ac89aab1cfbfad3459e950a1998263b40f413c`
- **Variants**: 90
- **Properties**:
  - `Stacked` (VARIANT) — options: 1, 2, 3 [default: 1]
  - `Direction` (VARIANT) — options: Vertical, Horizontal [default: Vertical]
  - `Percentage` (VARIANT) — options: 100%, 75%, 50%, 25%, 10%, -10%, -25%, -50%, -75%, -100% [default: 10%]
  - `Negative Values` (VARIANT) — options: False, True [default: False]

#### `Elements / Lines`
- **Set Key**: `2b6d74ff402a0e09e09e75b95538690f534583d8`
- **Default Variant Key**: `3644c6183563fdd5972fefd3f396b46e3b24ae55`
- **Variants**: 3
- **Properties**:
  - `Data Sets#1231:1` (BOOLEAN) [default: true]
  - `Fill Background#1231:2` (BOOLEAN) [default: false]
  - `Bullets?#1236:0` (BOOLEAN) [default: true]
  - `Data Values` (VARIANT) — options: 1, 2, 3 [default: 1]

#### `Elements / Axis X | Groups Bottom`
- **Set Key**: `9ed9b373d51c2e3ce9638b337b91f3990bea833c`
- **Default Variant Key**: `d6372888de4619813a9fe5abc52eebbf8a28f961`
- **Variants**: 1
- **Properties**:
  - `Label?#1190:0` (BOOLEAN) [default: false]
  - `Label#1190:1` (TEXT) [default: Label]
  - `Groups` (VARIANT) — options: 7 [default: 7]

#### `Elements / Axis X | Groups Top`
- **Set Key**: `940b6afaffe7493f9046a071bf19ca68caa5209e`
- **Default Variant Key**: `3b7b8ff555ed06fbb12ff2d6c6c796560ee35108`
- **Variants**: 1
- **Properties**:
  - `Label#1190:2` (TEXT) [default: Label]
  - `Label?#1190:3` (BOOLEAN) [default: false]
  - `Groups` (VARIANT) — options: 7 [default: 7]

#### `Elements / Axis X | Values Bottom`
- **Set Key**: `1ae6466480100bee224a725f815041729e0c9482`
- **Default Variant Key**: `df687dfc3ae6107c308b64ec6b8e49eda391f379`
- **Variants**: 1
- **Properties**:
  - `Label?#1190:0` (BOOLEAN) [default: false]
  - `Label#1190:1` (TEXT) [default: Label]
  - `Values` (VARIANT) — options: 7 [default: 7]

#### `Elements / Axis X | Values Top`
- **Set Key**: `8cf161d60b16e0b41795905ab0603f730e6a36c0`
- **Default Variant Key**: `7bbe5c34b9519e346afefefd8b7151ce4327ff3c`
- **Variants**: 1
- **Properties**:
  - `Label?#1190:0` (BOOLEAN) [default: false]
  - `Label#1190:1` (TEXT) [default: Label]
  - `Values` (VARIANT) — options: 7 [default: 7]

#### `Elements / Axis Y | Values Left`
- **Set Key**: `d25a2296d4d55f575126ccd8d97e652ec856cd54`
- **Default Variant Key**: `01ce0a8d7330afb0f2c807dbe626b4a425055132`
- **Variants**: 1
- **Properties**:
  - `Label#1190:4` (TEXT) [default: Label]
  - `Label?#1190:5` (BOOLEAN) [default: false]
  - `Values` (VARIANT) — options: 7 [default: 7]

#### `Elements / Axis Y | Values Right`
- **Set Key**: `af314c465eafe8553c722073368df11cbe3915fc`
- **Default Variant Key**: `d86483dcd1eb690dffcabe2881b2988270a13a5a`
- **Variants**: 1
- **Properties**:
  - `Label#1190:4` (TEXT) [default: Label]
  - `Label?#1190:5` (BOOLEAN) [default: false]
  - `Values` (VARIANT) — options: 7 [default: 7]

#### `Elements / Legend`
- **Set Key**: `1803bc7800c679ce9d6f9391b028c2b1e3718b29`
- **Default Variant Key**: `28c61ad46003de67878d6e9a39a927bed76f3a41`
- **Variants**: 2
- **Properties**:
  - `Series 1#12:5` (TEXT) [default: Series 1]
  - `Series 2#12:8` (TEXT) [default: Series 2]
  - `Series 3#85:12` (TEXT) [default: Series 3]
  - `Series 2?#121:0` (BOOLEAN) [default: true]
  - `Series 3?#121:3` (BOOLEAN) [default: true]
  - `Series 4#1187:14` (TEXT) [default: Series 4]
  - `Series 4?#1187:17` (BOOLEAN) [default: true]
  - `Direction` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]

#### `Elements / Tooltip`
- **Set Key**: `a8f9b705c39b9ad133d79a43d43d8efa2726ea46`
- **Default Variant Key**: `e2b0c396b75c8998e7c079e92bb01bf39465ffb7`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: axis, item [default: item]

#### `Elements / Series Bar`
- **Set Key**: `45ecfe41f56aa6c89cec8c9695b58e5d80db5698`
- **Default Variant Key**: `fae6f5efccdc1b6c60014202f06ade9ec56b28ff`
- **Variants**: 6
- **Properties**:
  - `Series` (VARIANT) — options: 1, 2, 3, 4 [default: 1]
  - `Values` (VARIANT) — options: 7 [default: 7]
  - `Stacked` (VARIANT) — options: 1, 2, 3 [default: 1]

#### `<BarChart>`
- **Set Key**: `746102812f2d9706c52a97ccb5fb2ffcafd46220`
- **Default Variant Key**: `60e5caf9c9115e0d9864fb424b190cdb42f21e42`
- **Variants**: 15
- **Properties**:
  - `Legend?#1191:18` (BOOLEAN) [default: true]
  - `Type` (VARIANT) — options: Simple, Grouped Bars, Stacked Bars [default: Simple]
  - `X Axis?` (VARIANT) — options: False, True [default: True]
  - `Y Axis?` (VARIANT) — options: True, False, Biaxial [default: True]

#### `<LineChart>`
- **Set Key**: `83b419a16d1950ce9066f304a1ec7e14f3d6910a`
- **Default Variant Key**: `a8f9a6e36992695818d7f3ec1cebed92365cccc5`
- **Variants**: 15
- **Properties**:
  - `Legend?#1191:18` (BOOLEAN) [default: true]
  - `Type` (VARIANT) — options: Simple, Grouped Bars, Stacked Bars [default: Simple]
  - `X Axis?` (VARIANT) — options: False, True [default: True]
  - `Y Axis?` (VARIANT) — options: True, False, Biaxial [default: True]

#### `<PieChart>`
- **Set Key**: `45ad36f55f257cb799e42a82405e6f9048261a70`
- **Default Variant Key**: `6426d3f036972ac0a3915a318c65be6afb8fa59e`
- **Variants**: 13
- **Properties**:
  - `Text#74:0` (TEXT) [default: Label]
  - `Type` (VARIANT) — options: Simple, StraightAngle, TwoLevel, PaddingAngle, CenterLabel, PaddingStraightAngle, CustomizedLabel [default: Simple]
  - `Hole` (VARIANT) — options: 75%, 0%, 25%, 50% [default: 0%]

#### `<ScatterChart>`
- **Set Key**: `a38687c758aba10da0464ccd87f5bacf43f182f5`
- **Default Variant Key**: `1aacff16e2dcc0b4493d25a4d6c8e95156327c02`
- **Variants**: 6
- **Properties**:
  - `Data` (VARIANT) — options: 1, 2, 3 [default: 1]
  - `Axis` (VARIANT) — options: Single, Multiple [default: Single]

### Checkbox

#### `<Checkbox>`
- **Set Key**: `decaa987c703391a7f90ac205e838ca8a64f6bc0`
- **Default Variant Key**: `3dcc19a3781b1eb85886d22c753b394ee18e06bf`
- **Variants**: 246
- **Properties**:
  - `Checked` (VARIANT) — options: False, True [default: False]
  - `Indeterminate` (VARIANT) — options: False, True [default: False]
  - `Size` (VARIANT) — options: Medium, Small, Large [default: Medium]
  - `Color` (VARIANT) — options: Default, Primary, Secondary, Error, Info, Success, Warning [default: Primary]
  - `State` (VARIANT) — options: Enabled, Hovered, Focused, Pressed, Disabled [default: Enabled]

#### `<FormControlLabel> | Checkbox`
- **Set Key**: `3d03411e246ff7dee1bb3ac248bc8d3760e0bbd7`
- **Default Variant Key**: `441ebea2de1a466c3cb507d2889acc23fe5fe840`
- **Variants**: 8
- **Properties**:
  - `Label Placement` (VARIANT) — options: End, Start, Top, Bottom [default: End]
  - `Disabled` (VARIANT) — options: False, True [default: False]

#### `<FormGroup> | <Checkbox>`
- **Set Key**: `d106b4bd16f70becf9fbd50cee80d55894f0d3de`
- **Default Variant Key**: `3f0961e857a1066e0d8ca031d9f191bf81f51e91`
- **Variants**: 6
- **Properties**:
  - `<FormLabel>#642:4` (BOOLEAN) [default: true]
  - `<FormHelperText>#642:8` (BOOLEAN) [default: true]
  - `State` (VARIANT) — options: Enabled, Disabled, Error [default: Enabled]
  - `Checkboxes` (VARIANT) — options: 3, 5 [default: 3]

### Chip

#### `Chip`
- **Set Key**: `1a307f1cfd00f8b0611262f9b82b3c8fc6522010`
- **Default Variant Key**: `06e566f8ad1c0154f850ac4fecb74c3b3b63f657`
- **Variants**: 288
- **Properties**:
  - `Icon#2994:0` (BOOLEAN) [default: true]
  - `Icon Instance#2994:25` (INSTANCE_SWAP) [default: 18350:926180]
  - `Chip Label#18107:0` (TEXT) [default: Chip Label]
  - `Delete Icon#18645:2` (BOOLEAN) [default: false]
  - `Delete Icon Instance#18645:4` (INSTANCE_SWAP) [default: 19298:2514]
  - `Avatar#18645:6` (BOOLEAN) [default: false]
  - `Color` (VARIANT) — options: Gray - Neutral, Cerulean, Jade, Magenta, Orange, Pear - Success, Purple - In Progress, Red - Error, Terracotta - Warning, Yellow (+2 more) [default: Gray - Neutral]
  - `Size` (VARIANT) — options: Medium (Default), Small, Large [default: Medium (Default)]
  - `Style` (VARIANT) — options: Default, Outlined, Minimal, Strong [default: Default]
  - `Hover` (VARIANT) — options: False, True [default: False]

### Container

#### `<Container>`
- **Set Key**: `eb7713b2137b89c46f8be2a9daac821a973e701a`
- **Default Variant Key**: `84fafdd13ec44f23229b0d6782dfb37dd790ec2a`
- **Variants**: 10
- **Properties**:
  - `Max Width` (VARIANT) — options: Extra Large, Large, Medium, Small, Extra Small [default: Extra Large]
  - `Dis. Gutters` (VARIANT) — options: False, True [default: False]

### Date / Time

#### `date_picker_header`
- **Set Key**: `b439ca3bcffbb011232c115caa5397b61e6c2beb`
- **Default Variant Key**: `c86bfdf5fd836ada08ca6a9b770ee0fe8958662b`
- **Variants**: 3
- **Properties**:
  - `Property 1` (VARIANT) — options: Default, range_range, left_range [default: Default]

#### `arrow_button`
- **Set Key**: `15e27ebba3c8d749a9491c1e05fdaad54fe60706`
- **Default Variant Key**: `45e91921a1157f3e9caa4c2f7ca0e4a732575211`
- **Variants**: 4
- **Properties**:
  - `Property 1` (VARIANT) — options: left, right, right_hover, left_hover [default: left]

#### `dropdown_button`
- **Set Key**: `2f48a371201f7857e9ad6f004a5b455758b3745a`
- **Default Variant Key**: `c04dca1871d0436ffdadf64cbdc6690ebbf96345`
- **Variants**: 4
- **Properties**:
  - `State` (VARIANT) — options: Closed, Open [default: Closed]
  - `Hover` (VARIANT) — options: False, True [default: False]

#### `day_button`
- **Set Key**: `0aa700041d6d4646c5f63ede9f64029c42746f6c`
- **Default Variant Key**: `6e73a6eec1ea582301393ceae07cd5a1e5a89db8`
- **Variants**: 18
- **Properties**:
  - `Variant` (VARIANT) — options: Hidden, Current, Date, Focused, Header, Hover, Past, Range End, Range Hover End, Range Hover End 2 (+8 more) [default: Date]

#### `month_button`
- **Set Key**: `a35306d8e07ce759e29d4583b16d7f1b413cd9ea`
- **Default Variant Key**: `e0060aa280ad823b011e4b29b338db4221950387`
- **Variants**: 5
- **Properties**:
  - `Property 1` (VARIANT) — options: Default, hover, current, selected, focused [default: Default]

#### `Date Picker`
- **Set Key**: `596d1286dfbb918dd180ec20ea74eeed38e26ee4`
- **Default Variant Key**: `e2d7058ab1fcc110d30285378785350f03951d2f`
- **Variants**: 3
- **Properties**:
  - `Footer#16369:1` (BOOLEAN) [default: false]
  - `View` (VARIANT) — options: Calendar, Month, Year [default: Calendar]

### Dialog

#### `Dialog`
- **Set Key**: `43dde425424de404967f142c30f704dcbb087c2a`
- **Default Variant Key**: `57a2dfff9023c86a54a13b050bc20bb4230802a6`
- **Variants**: 4
- **Properties**:
  - `Dismissible#10310:0` (BOOLEAN) [default: true]
  - `Status` (VARIANT) — options: Basic, Warning, Error, Success [default: Basic]

### Divider

#### `Divider`
- **Set Key**: `6220bea7da4756b30bf4c62afc80e1bc63c92053`
- **Default Variant Key**: `4536220715972b309da9acd09c15884808b94b9a`
- **Variants**: 4
- **Properties**:
  - `Middle` (VARIANT) — options: And, Button, 2 Butttons, Default [default: Default]

### Floating Action Button

#### `<Fab>`
- **Set Key**: `06e3291c21c43d80b17d89ae3014fa5ca0ca83b3`
- **Default Variant Key**: `9b981705e1c49027ae98880bedcc98dd5276f0d8`
- **Variants**: 150
- **Properties**:
  - `Icon?#10003:7` (BOOLEAN) [default: true]
  - `Label#11069:676` (TEXT) [default: Fab]
  - `Variant` (VARIANT) — options: Extended, Round [default: Extended]
  - `Size` (VARIANT) — options: Large, Medium, Small [default: Large]
  - `Color` (VARIANT) — options: Default, Primary, Secondary, Inherit, Inherit (white) [default: Default]
  - `State` (VARIANT) — options: Enabled, Hovered, Focused, Pressed, Disabled [default: Enabled]

### Form Labels

#### `FormLabel`
- **Set Key**: `4189fdf0bd43f2ae4a76b0f5c4d4634d062c2b59`
- **Default Variant Key**: `23636b45c4f9d0a1aa17ce4678cf7af03be9e8a3`
- **Variants**: 18
- **Properties**:
  - `Value#11437:4` (TEXT) [default: Label]
  - `Color` (VARIANT) — options: -, Primary, Secondary, Error, Warning, Info, Success [default: -]
  - `State` (VARIANT) — options: Enabled, Disabled, Error [default: Enabled]
  - `Size` (VARIANT) — options: Medium, Small [default: Medium]

### Icon Button

#### `<IconButton>`
- **Set Key**: `ee7f330609716124cb4f2eecae4423cd56f1b1e7`
- **Default Variant Key**: `4221d9c866ff65b479768b4641fc6173290ad509`
- **Variants**: 135
- **Properties**:
  - `Size` (VARIANT) — options: Medium, Small, Large [default: Medium]
  - `Color` (VARIANT) — options: Default, Primary, Secondary, Error, Warning, Info, Success, Inherit, Inherit (white) [default: Default]
  - `State` (VARIANT) — options: Enabled, Hovered, Focused, Pressed, Disabled [default: Enabled]

#### `<Icon>`
- **Set Key**: `9c7618a636bd23a9159d998bad8c45b9333bcf1a`
- **Default Variant Key**: `5c7c074588e779b3899b0c9cbe3b272581ebdd6c`
- **Variants**: 8
- **Properties**:
  - `Icon Instance#10003:412` (INSTANCE_SWAP) [default: 7475:49603]
  - `Size` (VARIANT) — options: Medium, Large, Small, Inherit [default: Medium]
  - `Type` (VARIANT) — options: SVG Icon, Font Icon [default: SVG Icon]

### Image List

#### `<ImageListItemBar>`
- **Set Key**: `a3cc5bbfa54f19743c4a46945160337e3db25427`
- **Default Variant Key**: `f58307bc782552de9c75f9c62ee1c849cc9120f5`
- **Variants**: 2
- **Properties**:
  - `Subtitle?#1606:0` (BOOLEAN) [default: true]
  - `Title?#1606:3` (BOOLEAN) [default: true]
  - `Title#1606:6` (TEXT) [default: {Title}]
  - `Subtitle#1606:9` (TEXT) [default: {Subtitle}]
  - `↳ Action#1606:12` (INSTANCE_SWAP) [default: 11496:178655]
  - `Action?#1606:15` (BOOLEAN) [default: true]
  - `ImageListItemBar?#1606:18` (BOOLEAN) [default: true]
  - `Action Position` (VARIANT) — options: Left, Right [default: Right]

#### `Aspect ratio`
- **Set Key**: `d09515d68c40086ad45aa9226823664cd1abfa26`
- **Default Variant Key**: `d18e5e91c856c2804ef53fb15faa103fc9cda981`
- **Variants**: 25
- **Properties**:
  - `Aspect ratio` (VARIANT) — options: 1:1, 1:2, 2:1, 2:3, 3:1, 3:2, 3:4, 4:1, 4:3, 4:5 (+15 more) [default: 1:1]

### Label/Value Pair

#### `Label-Value`
- **Set Key**: `b33204d86215b6e622fde1422f2c536e4ea8074c`
- **Default Variant Key**: `013efe9036f4950d985d3ed193bad2cf54aaab97`
- **Variants**: 4
- **Properties**:
  - `Show Trend#220:0` (BOOLEAN) [default: true]
  - `Trend Icon#246:2` (INSTANCE_SWAP) [default: 7432:51081]
  - `Value as Chip` (VARIANT) — options: False, True [default: False]
  - `Stacked` (VARIANT) — options: False, True [default: False]

### Link

#### `Link`
- **Set Key**: `3c37c5b1b73ff3f5b85fc17322de631c9bd87faa`
- **Default Variant Key**: `56535b856a0e4317aa23605563a8931b64b67e8f`
- **Variants**: 18
- **Properties**:
  - `Icon Right#6178:0` (BOOLEAN) [default: true]
  - `Label#20795:0` (TEXT) [default: View more]
  - `Icon Left#20795:13` (BOOLEAN) [default: false]
  - `Icon Right Component#20795:26` (INSTANCE_SWAP) [default: 18471:28036]
  - `Icon Left Component#20795:39` (INSTANCE_SWAP) [default: 17621:17672]
  - `Type` (VARIANT) — options: Standalone, Inline [default: Standalone]
  - `Size` (VARIANT) — options: Small, Medium, Large, Larg [default: Medium]
  - `State` (VARIANT) — options: Default, Hover, Disabled [default: Default]

### List

#### `<ListItem>`
- **Set Key**: `241fd24cde3de6569bbd85ef5fd37b23bd28b460`
- **Default Variant Key**: `a5074f69fed62cd6aaaef8c23e3fd76301befecb`
- **Variants**: 24
- **Properties**:
  - `Second. Text#10036:44` (BOOLEAN) [default: true]
  - `Divider#10055:0` (BOOLEAN) [default: false]
  - `Left Slot?#10055:33` (BOOLEAN) [default: true]
  - `Right Slot?#10055:165` (BOOLEAN) [default: false]
  - `Left Slot#10107:49` (INSTANCE_SWAP) [default: 6594:47651]
  - `Right Slot#10107:82` (INSTANCE_SWAP) [default: 7497:50687]
  - `Label#11069:1721` (TEXT) [default: List item]
  - `Dense` (VARIANT) — options: False, True [default: False]
  - `Dis. Gutters` (VARIANT) — options: False, True [default: False]
  - `State` (VARIANT) — options: Enabled, Hovered, Selected, Focused, Pressed, Disabled [default: Enabled]

#### `<List>`
- **Set Key**: `6e97c142644949ebe1c5c98c7b80f1ab51fbabed`
- **Default Variant Key**: `05b7c2ad2d1c2270f305f548937b11b1c0e5a471`
- **Variants**: 4
- **Properties**:
  - `Dis. Padding` (VARIANT) — options: False, True [default: False]
  - `Dense` (VARIANT) — options: False, True [default: False]

### Menu

#### `<MenuItem>`
- **Set Key**: `34b3224972937e33bb8c68582aaefe8df554ab27`
- **Default Variant Key**: `7df205ce58238ef1cebd8e02f022b37696cd396b`
- **Variants**: 24
- **Properties**:
  - `Left Slot#10068:25` (BOOLEAN) [default: true]
  - `Right Slot#10068:74` (BOOLEAN) [default: false]
  - `Divider#10070:0` (BOOLEAN) [default: false]
  - `Right Instance#10107:0` (INSTANCE_SWAP) [default: 11626:152457]
  - `Value#11073:1880` (TEXT) [default: Menu Item]
  - `Left Instance#11172:557` (INSTANCE_SWAP) [default: 6594:47651]
  - `Description#12924:0` (BOOLEAN) [default: false]
  - `Small Screen` (VARIANT) — options: False, True [default: False]
  - `Dense` (VARIANT) — options: False, True [default: False]
  - `Dis. Gutters` (VARIANT) — options: False, True [default: False]
  - `State` (VARIANT) — options: Enabled, Hovered, Selected, Disabled [default: Enabled]

#### `<MenuList>`
- **Set Key**: `e07ff9903d5be0c0687f98f51f0c8337b556c6dc`
- **Default Variant Key**: `5789db8a7d37b954878ed8b7a29b4e628e5570ac`
- **Variants**: 12
- **Properties**:
  - `Auto Width` (VARIANT) — options: False, True [default: False]
  - `Dense` (VARIANT) — options: False, True [default: False]
  - `Small Screen` (VARIANT) — options: False, True [default: False]
  - `Dis. Gutters` (VARIANT) — options: False, True [default: False]

#### `<Menu>`
- **Set Key**: `5822f4052debbba463e09fe4fbd11cb50d0d45ad`
- **Default Variant Key**: `32d07b8575c514163489addcae79c5657a481528`
- **Variants**: 4
- **Properties**:
  - `Auto Width` (VARIANT) — options: False, True [default: False]
  - `Max Height` (VARIANT) — options: False, True [default: False]

### Misc

#### `_Library / Logo Placeholder`
- **Set Key**: `0ed5289e9426d964b763c0369c2192c30aa1edf7`
- **Default Variant Key**: `6e06ca8c638f6bedec28caa09d258b4d0ed8bb9a`
- **Variants**: 2
- **Properties**:
  - `Variant` (VARIANT) — options: Variant 2, Variant3 [default: Variant 2]

#### `_Library / MUI Logos`
- **Set Key**: `4306875b042954df5bef3b0ff4e39ad212afae8b`
- **Default Variant Key**: `b5ebf174d7e53bf4a7e7d9464c96b5713fc057f6`
- **Variants**: 3
- **Properties**:
  - `Brand` (VARIANT) — options: Logo, MUI X - Pro, MUI X - Premium [default: Logo]

#### `_Native Browser Scroll`
- **Set Key**: `9453753c30a64e51b55ce7adfc5ffac2ee3333b5`
- **Default Variant Key**: `23b606b6f2bab479e96db4ab1c341804ef275b7b`
- **Variants**: 2
- **Properties**:
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]

#### `_Library / Component Properties`
- **Set Key**: `fb97f36b7d09336e5182c3e0f06cb76be6360be8`
- **Default Variant Key**: `7038176e3818bae0805e868eedd226073addcd3d`
- **Variants**: 4
- **Properties**:
  - `Type` (VARIANT) — options: Variant, Boolean, Text, Instance Swap [default: Variant]

### Paper

#### `<Paper>`
- **Set Key**: `3348b0f144843164290abd47754c77e9871187f8`
- **Default Variant Key**: `ecfbc914a95272c64294cb83bef579b802dc4dae`
- **Variants**: 52
- **Properties**:
  - `Instance Slot?#166:0` (BOOLEAN) [default: true]
  - `↳ Instance#11049:0` (INSTANCE_SWAP) [default: 10020:110248]
  - `Variant` (VARIANT) — options: Elevation, Outlined [default: Elevation]
  - `Elevation` (VARIANT) — options: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 (+15 more) [default: 1]
  - `Square` (VARIANT) — options: False, True [default: False]

### Progress

#### `<Progress> | Linear`
- **Set Key**: `487e9cb4ce8f1c0fce07162e85019b773aad5c46`
- **Default Variant Key**: `b62a72cbf188aeabb0b5e2cef6638150add94c43`
- **Variants**: 9
- **Properties**:
  - `Label#10056:506` (BOOLEAN) [default: false]
  - `Type` (VARIANT) — options: Determinate, Buffer, Indeterminate [default: Determinate]
  - `Color` (VARIANT) — options: Inherit, Primary, Secondary [default: Primary]

#### `<Progress> | Circular`
- **Set Key**: `ccb8d104d5e2533b6fb84870bf022a46ee0c55f5`
- **Default Variant Key**: `31f245d75914a86f113a33621c2b2f7dbe9e05dc`
- **Variants**: 6
- **Properties**:
  - `Label#10056:543` (BOOLEAN) [default: true]
  - `Color` (VARIANT) — options: Primary, Secondary, Inherit [default: Primary]
  - `Size` (VARIANT) — options: 32px, 16px [default: 32px]

### Radio Group

#### `<Radio>`
- **Set Key**: `05a6736c7d1e31f46e007d008c5a362ac2145c2c`
- **Default Variant Key**: `c6846f066345f909ff132780006af1223611ce03`
- **Variants**: 174
- **Properties**:
  - `Checked` (VARIANT) — options: False, True [default: False]
  - `Size` (VARIANT) — options: Medium, Small, Large [default: Medium]
  - `Color` (VARIANT) — options: Primary, Default, Secondary, Error, Warning, Info, Success [default: Primary]
  - `State` (VARIANT) — options: Enabled, Hovered, Focused, Disabled, Pressed [default: Enabled]

#### `<FormControlLabel> | Radio`
- **Set Key**: `cd8b714def8c439a51142132e96de92f98477915`
- **Default Variant Key**: `8f4adabf8595680044ea14d67a1c59929524ff6f`
- **Variants**: 8
- **Properties**:
  - `Label Placement` (VARIANT) — options: End, Start, Top, Bottom [default: End]
  - `Disabled` (VARIANT) — options: False, True [default: False]

#### `<RadioGroup>`
- **Set Key**: `09af4d4cba1003918fda38a033bdc88b1ea1f897`
- **Default Variant Key**: `a39eff09e041c7072c82db9e3d5d524b942b0c22`
- **Variants**: 8
- **Properties**:
  - `Radios` (VARIANT) — options: 3, 5 [default: 3]
  - `Disabled` (VARIANT) — options: False, True [default: False]
  - `Row` (VARIANT) — options: False, True [default: False]

#### `<FormGroup> | <RadioGroup>`
- **Set Key**: `d28fb215dfaf5f46217f3eb0bdd9cc8ff47f2f59`
- **Default Variant Key**: `156cd9c194fbf4a81cd51affcf2cbc4c6437fe7f`
- **Variants**: 3
- **Properties**:
  - `<FormLabel>#642:4` (BOOLEAN) [default: true]
  - `<FormHelperText>#642:8` (BOOLEAN) [default: true]
  - `State` (VARIANT) — options: Enabled, Disabled, Error [default: Enabled]
  - `Checkboxes` (VARIANT) — options: 3 [default: 3]

### Rating

#### `Star`
- **Set Key**: `9aab6de77fce2fdfb8d8b9cfb4657c3f90293960`
- **Default Variant Key**: `5da48d54999ef7f72faa19ddda34ce9bc733bc95`
- **Variants**: 15
- **Properties**:
  - `Size` (VARIANT) — options: Large, Medium*, Small [default: Large]
  - `Active` (VARIANT) — options: False, Half, Full [default: False]
  - `Hovered` (VARIANT) — options: false, true [default: false]

#### `<Rating>`
- **Set Key**: `53e0a74b4e040b349fa162875166c32b1b3b4865`
- **Default Variant Key**: `09a04c19aaae54526adddd927fc12fe89ec491cd`
- **Variants**: 6
- **Properties**:
  - `Size` (VARIANT) — options: Large, Medium*, Small [default: Medium*]
  - `Disabled` (VARIANT) — options: False, True [default: False]

### Select

#### `Autocomplete`
- **Set Key**: `836b9691beeebd374d9ba019277a3480b6f95777`
- **Default Variant Key**: `5ef634d55a59c4a4e9d1db63d26bd73718905f12`
- **Variants**: 18
- **Properties**:
  - `Show Label#10286:14` (BOOLEAN) [default: true]
  - `Show Focus Ring#12240:0` (BOOLEAN) [default: false]
  - `Status` (VARIANT) — options: Idle, Disabled, Hover [default: Idle]
  - `Size` (VARIANT) — options: Medium (Default), Small, Large [default: Small]
  - `Select` (VARIANT) — options: Single, Multiple [default: Single]

### Skeleton

#### `<Skeleton>`
- **Set Key**: `7f7cfd46476931e74f50fb0c9265391ca3dbd810`
- **Default Variant Key**: `71fd58b56f8d15081955a3950becf082317413f7`
- **Variants**: 3
- **Properties**:
  - `Shape` (VARIANT) — options: Text, Circle, Rectangle [default: Text]

### Slider

#### `_SliderTrack`
- **Set Key**: `28389d0015ad39e7b8b2c21708fa82a70ad1fb73`
- **Default Variant Key**: `5b3d5cd828973399c174aad722f78971c49ed202`
- **Variants**: 12
- **Properties**:
  - `Size` (VARIANT) — options: Small, Medium [default: Small]
  - `Color` (VARIANT) — options: None, Primary, Secondary [default: Primary]
  - `Disabled` (VARIANT) — options: False, True [default: False]
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]

#### `_SliderRail`
- **Set Key**: `e5a6c768b375adc38407ec98619f72866d6aec25`
- **Default Variant Key**: `058c879c3c0df23d7530b8cdeb1fd3a3229d115c`
- **Variants**: 12
- **Properties**:
  - `Size` (VARIANT) — options: Small, Medium [default: Small]
  - `Color` (VARIANT) — options: None, Primary, Secondary [default: Primary]
  - `Disabled` (VARIANT) — options: False, True [default: False]
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]

#### `_SliderMark`
- **Set Key**: `ac36cedb50defe5acaad7618858f7a846eb5504d`
- **Default Variant Key**: `058bc1d47f0606669f12e9b2c10ccbe0d568748b`
- **Variants**: 6
- **Properties**:
  - `Active` (VARIANT) — options: false, true [default: false]
  - `Color` (VARIANT) — options: None, Primary, Secondary [default: Primary]
  - `Disabled` (VARIANT) — options: false, true [default: false]

#### `_SliderThumb`
- **Set Key**: `dd73789f17482706caede2b7b4c3620813d22e87`
- **Default Variant Key**: `41f1e2def7e0e38ec99af06b1b0e586d6a2886f3`
- **Variants**: 6
- **Properties**:
  - `Size` (VARIANT) — options: Small, Medium [default: Small]
  - `Color` (VARIANT) — options: None, Primary, Secondary [default: Primary]
  - `Disabled` (VARIANT) — options: false, true [default: false]

#### `_SliderValue Label`
- **Set Key**: `674284d505245262af40d8742faab12eaddae996`
- **Default Variant Key**: `36ad86e4a7a35ba78e48cd1ca15fc61f8e701430`
- **Variants**: 2
- **Properties**:
  - `Label#11073:2320` (TEXT) [default: 12]
  - `Active` (VARIANT) — options: true, false [default: true]

#### `_SliderLabel`
- **Set Key**: `bbf536fb0fee96c9c36820ee9fca1becb7781174`
- **Default Variant Key**: `49bceb1353f57f439dc95cf89e3b3478dd5a8c9a`
- **Variants**: 2
- **Properties**:
  - `Label#11073:2325` (TEXT) [default: 20]
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]

#### `<Slider>`
- **Set Key**: `2063ada97b848ef0904af953e792167ab449a935`
- **Default Variant Key**: `ec90b8761c358f36c1a25c34121c8135fcee8aec`
- **Variants**: 66
- **Properties**:
  - `Values#10056:550` (BOOLEAN) [default: true]
  - `Label#10056:611` (BOOLEAN) [default: false]
  - `Size` (VARIANT) — options: Small, Medium [default: Medium]
  - `Variant` (VARIANT) — options: Continuous, Marks, Range [default: Continuous]
  - `Color` (VARIANT) — options: Primary, Secondary [default: Primary]
  - `State` (VARIANT) — options: Enabled, Hover, Disabled [default: Enabled]
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]

### Snackbar

#### `Snackbar`
- **Set Key**: `15e76ff6ce4c0172ba82dddd2512873289b85bae`
- **Default Variant Key**: `457efc7645f0a105aba4ca4debc18d9650d78f74`
- **Variants**: 16
- **Properties**:
  - `Icon#11644:0` (BOOLEAN) [default: true]
  - `Dismissible#11644:3` (BOOLEAN) [default: true]
  - `Description#11644:6` (BOOLEAN) [default: true]
  - `Button#11648:12` (BOOLEAN) [default: true]
  - `Description Text#21236:0` (TEXT) [default: This content should be one line but can go to two if needed.]
  - `Type` (VARIANT) — options: Information, Warning, Error, Success [default: Information]
  - `Size` (VARIANT) — options: Small (Default), Large [default: Small (Default)]
  - `Complexity` (VARIANT) — options: Simple, Advance [default: Simple]

### Spacing

#### `Spacing | Horizontal`
- **Set Key**: `a5ae7168e0f54b615d3895229cdf638f2e682a26`
- **Default Variant Key**: `83a62cebbb4308dd7a44d7c520f29306663e84cf`
- **Variants**: 16
- **Properties**:
  - `Spacing` (VARIANT) — options: 1, 2, 3, 4, 5, 6, 7, 8 [default: 1]
  - `Visibility` (VARIANT) — options: False, True [default: True]

#### `Spacing | Vertical`
- **Set Key**: `176133453169e636fa3e3d8d86f11b0d594841cc`
- **Default Variant Key**: `c7003a1af37769da76b94c21c30d0858bce05c68`
- **Variants**: 16
- **Properties**:
  - `Spacing` (VARIANT) — options: 1, 2, 3, 4, 5, 6, 7, 8 [default: 1]
  - `Visibility` (VARIANT) — options: True, False [default: True]

### Speed Dial

#### `<SpeedDial>`
- **Set Key**: `fa1f2d53d70d8a094193a6dbe4f02be05db2b9c3`
- **Default Variant Key**: `1cbea68492a077aa1c3589b4f2ab1db945b80f1c`
- **Variants**: 4
- **Properties**:
  - `Instance#10183:3` (INSTANCE_SWAP) [default: 7618:74537]
  - `Direction` (VARIANT) — options: Up, Left, Right, Down [default: Up]

### Stack

#### `<Stack>`
- **Set Key**: `e90d64cd062e1d34a1f9c73ed5e8358546ee8d96`
- **Default Variant Key**: `82f77713f85ce8d5e9e3b3409c12e07dd54035b4`
- **Variants**: 75
- **Properties**:
  - `Instance #1#11480:3` (INSTANCE_SWAP) [default: 10020:110248]
  - `Instance #2#11480:94` (INSTANCE_SWAP) [default: 10020:110248]
  - `Instance #3#11480:185` (INSTANCE_SWAP) [default: 10020:110248]
  - `Instance #4#11480:276` (INSTANCE_SWAP) [default: 10020:110248]
  - `Instance #5#11480:367` (INSTANCE_SWAP) [default: 10020:110248]
  - `Instances` (VARIANT) — options: 1, 2, 3, 4, 5+ [default: 2]
  - `Direction` (VARIANT) — options: Column, Row [default: Row]
  - `Spacing` (VARIANT) — options: 1, 0, 2, 3, 4, 5, 6, 7, 8 [default: 1]

### Stepper

#### `Step Icon`
- **Set Key**: `130a9d29726b568f1f5a0ce19c8c2a18cbe9c19b`
- **Default Variant Key**: `69d6fad63184f6fcd3ffb2f8fee60bb65b303507`
- **Variants**: 2
- **Properties**:
  - `Step Count#17457:31` (TEXT) [default: 1]
  - `State` (VARIANT) — options: Default, Done [default: Default]

#### `<Step>`
- **Set Key**: `8242fe147d9334614ba0b77b8d4093b6eb20a12c`
- **Default Variant Key**: `78efba0fde2018a819a71b2bf2ff1853ed0728eb`
- **Variants**: 14
- **Properties**:
  - `Optional#9914:269` (BOOLEAN) [default: true]
  - `Step Title Content#11073:1954` (TEXT) [default: Step title]
  - `Optional Content#11073:1983` (TEXT) [default: Optional]
  - `Step Count#17460:0` (TEXT) [default: 1]
  - `Text` (VARIANT) — options: Center, Left [default: Left]
  - `State` (VARIANT) — options: Active, Inactive, Complete, Error, Warning, Info, Success [default: Inactive]

#### `<MobileStepper>`
- **Set Key**: `08fc4e581d81a0fee6ec96b0f2b321d0341a92b0`
- **Default Variant Key**: `e452b143877a11ce8dbbbbdefeb97f7aa22b50a9`
- **Variants**: 3
- **Properties**:
  - `Progress Type` (VARIANT) — options: Text, Dots, Progress [default: Text]

#### `<Stepper>`
- **Set Key**: `64f774d1bc72ea4fc075e3b0e9cf8e5e0f44270d`
- **Default Variant Key**: `f7043931a03296ae6747a684b34cb47ead04a29c`
- **Variants**: 12
- **Properties**:
  - `Small Screen` (VARIANT) — options: false, true [default: false]
  - `Optional` (VARIANT) — options: false, true [default: false]
  - `Text` (VARIANT) — options: Center, Left [default: Left]
  - `Alignment` (VARIANT) — options: Horizontal*, Vertical [default: Horizontal*]

### Switch

#### `<Switch>`
- **Set Key**: `fbd34dcd36e436bd86a0c116065b6fa0acad5f0d`
- **Default Variant Key**: `c1fe9a492eebd09f8b92898de870c1585e7bbc83`
- **Variants**: 116
- **Properties**:
  - `Checked` (VARIANT) — options: False, True [default: True]
  - `Size` (VARIANT) — options: Medium, Small [default: Medium]
  - `Color` (VARIANT) — options: Primary, Default, Secondary, Error, Warning, Info, Success [default: Primary]
  - `State` (VARIANT) — options: Enabled, Hovered, Disabled, Focused, Pressed [default: Enabled]

#### `<FormControlLabel> | Switch`
- **Set Key**: `cee5a32cf5c3238c6c583a27aaff41cfe3622bd0`
- **Default Variant Key**: `5a9dc308a4427e34518c23472c622a52089eba0a`
- **Variants**: 8
- **Properties**:
  - `Label Placement` (VARIANT) — options: End, Bottom, Start, Top [default: End]
  - `Disabled` (VARIANT) — options: False, True [default: False]

#### `<FormGroup> | <Switch>`
- **Set Key**: `064b76a511bc8452dba66d8c941abf5ebbe9b52b`
- **Default Variant Key**: `6b3465d336a3aff2567ac5a150d7ed8ef054f0a3`
- **Variants**: 6
- **Properties**:
  - `<FormLabel>#642:4` (BOOLEAN) [default: true]
  - `<FormHelperText>#642:8` (BOOLEAN) [default: true]
  - `State` (VARIANT) — options: Enabled, Disabled, Error [default: Enabled]
  - `Switches` (VARIANT) — options: 3, 5 [default: 3]

#### `<FormHelperText>`
- **Set Key**: `f6f4a3d92e883951b0fd4a11d665b2e691e49356`
- **Default Variant Key**: `3a19dcf3728d496733661c573caced26b1aec1d0`
- **Variants**: 3
- **Properties**:
  - `Value#11176:0` (TEXT) [default: Helper text]
  - `Disabled` (VARIANT) — options: Error, Disabled, Enabled [default: Enabled]

### Table

#### `Table Templates`
- **Set Key**: `4de2e7210077f586ad447262ef755865e54789bd`
- **Default Variant Key**: `8c2ab5a2395cc7172c995dc3ca668c094660f604`
- **Variants**: 4
- **Properties**:
  - `Table Type` (VARIANT) — options: Basic, Advanced, Pinned Columns, Indented [default: Basic]

#### `Table Header Cell`
- **Set Key**: `295025b5160994515629cd83a388b19048bad8ad`
- **Default Variant Key**: `84bca24545fc44125e4e2fc3d1abf1df53d2bab3`
- **Variants**: 2
- **Properties**:
  - `Label#16723:0` (BOOLEAN) [default: true]
  - `Description#17707:16` (BOOLEAN) [default: false]
  - `Filter Icon Instance#18330:8` (INSTANCE_SWAP) [default: 11868:22708]
  - `Sort Button Instance#18330:9` (INSTANCE_SWAP) [default: 11868:22710]
  - `Header Label#18330:10` (TEXT) [default: Header Label  with a crazy long text that will eventually truncate after it exceeds the ]
  - `Icon Left Instance#18330:11` (INSTANCE_SWAP) [default: 17621:19160]
  - `Pipe#18330:12` (BOOLEAN) [default: false]
  - `Icon Left#18330:13` (BOOLEAN) [default: false]
  - `Sort Button#18330:14` (BOOLEAN) [default: false]
  - `Checkbox#18330:15` (BOOLEAN) [default: false]
  - `Menu Button#18330:16` (BOOLEAN) [default: true]
  - `Filter Button#18330:17` (BOOLEAN) [default: true]
  - `Alignment` (VARIANT) — options: Left, Right [default: Left]

#### `Table Cell`
- **Set Key**: `5f0ddec5429800dc2e0b16c04b8df23acc5d91ae`
- **Default Variant Key**: `10edefacdd8a2b787d8c525e2183b4a3e8c9e5a2`
- **Variants**: 15
- **Properties**:
  - `Description#17703:0` (BOOLEAN) [default: false]
  - `Icon Left#18303:36` (BOOLEAN) [default: false]
  - `Avatar#18303:43` (BOOLEAN) [default: false]
  - `Chip#18303:44` (BOOLEAN) [default: false]
  - `Checkbox#18303:46` (BOOLEAN) [default: false]
  - `Icon Left Instance#18303:47` (INSTANCE_SWAP) [default: 17621:19160]
  - `Label#18303:48` (BOOLEAN) [default: true]
  - `Button#18318:60` (BOOLEAN) [default: false]
  - `Link#18318:65` (BOOLEAN) [default: false]
  - `Icon Right#18324:0` (BOOLEAN) [default: false]
  - `Icon Right Instance#18324:4` (INSTANCE_SWAP) [default: 17621:20196]
  - `Button Instance#18403:0` (INSTANCE_SWAP) [default: 14866:51385]
  - `TextField#18718:0` (BOOLEAN) [default: false]
  - `Row selection#19048:0` (BOOLEAN) [default: false]
  - `State` (VARIANT) — options: Default, Hover, Selected [default: Default]
  - `Alignment` (VARIANT) — options: Left, Right [default: Left]
  - `Indent` (VARIANT) — options: 0, 1, 2, 3 [default: 0]

### Tabs

#### `<Tab>`
- **Set Key**: `1d054f5e11705b4db381a38c88046cccc67ec687`
- **Default Variant Key**: `7f4924d49efde9d6fb134fad65fe9d679deed2ee`
- **Variants**: 48
- **Properties**:
  - `Icon#10238:0` (BOOLEAN) [default: true]
  - `Text#10238:13` (BOOLEAN) [default: true]
  - `Tab Content#11073:2012` (TEXT) [default: Tab]
  - `Show Badge#14912:0` (BOOLEAN) [default: false]
  - `Active` (VARIANT) — options: False, True [default: False]
  - `Active Color` (VARIANT) — options: None, Primary, Secondary [default: None]
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]
  - `Icon Position` (VARIANT) — options: Up, Left, Right [default: Left]
  - `State` (VARIANT) — options: Enabled, Disabled, Focused, Pressed [default: Enabled]

#### `<Tabs>`
- **Set Key**: `ff70026acecf6ffb6961a924f42f60faa522f121`
- **Default Variant Key**: `151be2af3d7fc2973a105254ca1955d500964e54`
- **Variants**: 6
- **Properties**:
  - `Scroll Visible#11443:133` (BOOLEAN) [default: false]
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]
  - `Small Screen` (VARIANT) — options: False, True [default: False]
  - `Variant` (VARIANT) — options: Standard, Scrollable, Full Width [default: Standard]

### Textfield

#### `TextField`
- **Set Key**: `bbdbd4e48d85a2c56eee2c295c0966cc238688c1`
- **Default Variant Key**: `815a07b757d8563e15d262c5318361497da6bb8e`
- **Variants**: 21
- **Properties**:
  - `Show Left Icon#8932:1` (BOOLEAN) [default: false]
  - `Show Right Icon#8932:2` (BOOLEAN) [default: false]
  - `Show Label#8932:3` (BOOLEAN) [default: true]
  - `Description#8932:5` (TEXT) [default: Example form item description]
  - `Label#8932:6` (TEXT) [default: Text Label]
  - `Show Description#8932:7` (BOOLEAN) [default: false]
  - `Text#8932:8` (TEXT) [default: Example text]
  - `Counter#8932:9` (BOOLEAN) [default: false]
  - `Required#8932:10` (BOOLEAN) [default: true]
  - `Left icon#10298:0` (INSTANCE_SWAP) [default: 18350:926180]
  - `Right icon#10298:22` (INSTANCE_SWAP) [default: 18350:926124]
  - `Show Focus Ring#12242:19` (BOOLEAN) [default: false]
  - `Help Text#16740:0` (BOOLEAN) [default: false]
  - `Instance#17386:0` (INSTANCE_SWAP) [default: 16740:30146]
  - `Info Icon#17508:22` (BOOLEAN) [default: false]
  - `State` (VARIANT) — options: Idle (Placeholder), Idle (Filled), Disabled, Error, Hover, Success, Read Only [default: Idle (Placeholder)]
  - `Size` (VARIANT) — options: Medium (Default), Small, Large [default: Medium (Default)]

#### `<ErrorMessage>`
- **Set Key**: `3a1cbee38565ea73f376f0f43fdc1573e0785dcc`
- **Default Variant Key**: `5128f9f894c1b21a2952799e24284ee4d5355933`
- **Variants**: 3
- **Properties**:
  - `Error Length` (VARIANT) — options: Small, Long [default: Small]
  - `Show Read More` (VARIANT) — options: True, False [default: False]

### Timeline

#### `<TimelineItem>`
- **Set Key**: `2df992942b03faa200bd7ffe598010cbdb565d97`
- **Default Variant Key**: `febf0ad7dac8b7f526d592eb53ff6afb0aca47d7`
- **Variants**: 4
- **Properties**:
  - `Opposing#9958:342` (BOOLEAN) [default: false]
  - `Position` (VARIANT) — options: Right, Left [default: Right]
  - `Variant` (VARIANT) — options: Filled, Outlined [default: Filled]

#### `<TimelineDot>`
- **Set Key**: `07cade488d8a13471808dc42889abe7dfe45c4cc`
- **Default Variant Key**: `a9574b42ac4290d5ae3b37f888f3bd15688d65a3`
- **Variants**: 2
- **Properties**:
  - `Variant` (VARIANT) — options: Filled*, Outlined [default: Filled*]

#### `<Timeline>`
- **Set Key**: `e1bc7895581b2bea6f270c121a33735b477e3979`
- **Default Variant Key**: `d5f754044ac5a0847c6a4fdbc63a3030add0e17b`
- **Variants**: 12
- **Properties**:
  - `Opposing` (VARIANT) — options: False, True [default: False]
  - `Variant` (VARIANT) — options: Filled, Outlined [default: Filled]
  - `Position` (VARIANT) — options: Right, Left, Alternating [default: Left]

### Toggle Button

#### `<ToggleButton>`
- **Set Key**: `235537dba6f0c845b42b2fa37ab89fb53b9030c1`
- **Default Variant Key**: `cf7e2c5e5826d2387173e7b5bd360069bcc9c90d`
- **Variants**: 30
- **Properties**:
  - `Text?#1502:61` (BOOLEAN) [default: false]
  - `Icon?#1502:92` (BOOLEAN) [default: true]
  - `Icon#10871:13` (INSTANCE_SWAP) [default: 7475:62358]
  - `Size` (VARIANT) — options: Large, Medium, Small [default: Large]
  - `State` (VARIANT) — options: Enabled, Hovered, Disabled, Focused, Pressed [default: Enabled]
  - `Selected` (VARIANT) — options: False, True [default: False]

#### `<ToggleButtonGroup>`
- **Set Key**: `c10ce0521c2ddfff7802e99d0ce6a523ac0ab683`
- **Default Variant Key**: `501d205f4b77d991dae03ac2a85a9da37a52c161`
- **Variants**: 9
- **Properties**:
  - `Orientation` (VARIANT) — options: Horizontal, Vertical [default: Horizontal]
  - `Size` (VARIANT) — options: Medium, Small, Large [default: Medium]
  - `Single` (VARIANT) — options: False, True [default: False]

### Tooltip

#### `<Tooltip>`
- **Set Key**: `56e0a9c21bc524a07363165dd5713f09393d43c2`
- **Default Variant Key**: `184ce193db9e76369908391b7dc71fc79cd380f0`
- **Variants**: 5
- **Properties**:
  - `Direction` (VARIANT) — options: None, Down, Up, Left, Right [default: None]

### Transfer List

#### `<TransferList>`
- **Set Key**: `0f21294f96e64d933f5943f6ee02c310426d2116`
- **Default Variant Key**: `d81d0559dc35d94eb04559164c1810a8623b3269`
- **Variants**: 2
- **Properties**:
  - `Variant` (VARIANT) — options: Enhanced, Simpled [default: Simpled]

### Tree View

#### `<TreeItem>`
- **Set Key**: `f326293f278abfffc45e7fa2a30722bdf6fcadc5`
- **Default Variant Key**: `88034a0c65cce7340eb82f3598c092201a1d85a8`
- **Variants**: 9
- **Properties**:
  - `Spacing#10264:55` (BOOLEAN) [default: false]
  - `Selected` (VARIANT) — options: False, True [default: False]
  - `Disabled` (VARIANT) — options: False, True [default: False]
  - `State` (VARIANT) — options: Default, Expandable, Expanded [default: Default]

#### `_Collapsed`
- **Set Key**: `c1d33d4af7fb607463fd2b4bba1565b325e15738`
- **Default Variant Key**: `7a2c18c385f973eeae99fa2ad43a412caf861863`
- **Variants**: 2
- **Properties**:
  - `State` (VARIANT) — options: True, False [default: True]

### ↳ Headings

#### `Page Heading`
- **Set Key**: `ed8d390034cdc9b76fc11e1e2647856ff734d33d`
- **Default Variant Key**: `17d737470c3a274dececd1d355b594e75e2622c1`
- **Variants**: 2
- **Properties**:
  - `Divider#10178:0` (BOOLEAN) [default: true]
  - `Breadcrumbs#10178:17` (BOOLEAN) [default: true]
  - `Subheader#10178:31` (BOOLEAN) [default: true]
  - `Actions#10178:45` (BOOLEAN) [default: true]
  - `Chip#12083:0` (BOOLEAN) [default: true]
  - `Description#12083:6` (BOOLEAN) [default: true]
  - `Small Screen` (VARIANT) — options: False, True [default: False]

#### `_Custom / Section Headings`
- **Set Key**: `322cc603378034f9326d1fdd046cd03b220b8fb8`
- **Default Variant Key**: `cf1fcef1da22ffed025dec80f1fcd131a22e4a90`
- **Variants**: 2
- **Properties**:
  - `Divider#10178:53` (BOOLEAN) [default: true]
  - `Subheader#10178:70` (BOOLEAN) [default: true]
  - `Actions Bottom#10178:80` (BOOLEAN) [default: true]
  - `Actions Right#10178:90` (BOOLEAN) [default: true]
  - `Small Screen` (VARIANT) — options: False, True [default: False]

### ↳ Navs

#### `_Custom / Expandable Nav Item`
- **Set Key**: `a7a9e7958a5ceb001fddd07ce45316ffa9a8d10d`
- **Default Variant Key**: `f6a2f3b87724ea30794cafb37586fe6813601e41`
- **Variants**: 2
- **Properties**:
  - `isOpen` (VARIANT) — options: True, False [default: False]

#### `_Custom / Sidenav`
- **Set Key**: `4d20b614601cce16b9da37db6b32047b1a4835c3`
- **Default Variant Key**: `f14e1ac510f53bdd097108e710c8366823987b2f`
- **Variants**: 4
- **Properties**:
  - `Small Screen` (VARIANT) — options: False, True [default: False]
  - `Variant` (VARIANT) — options: Default, Slim, Combined [default: Default]

### 🔠  Typography

#### `<Typography>`
- **Set Key**: `6499ac965918418c8e528d210840e2da71236f82`
- **Default Variant Key**: `e0a6ae85bec8b2a170b2681312fb31268ab571fa`
- **Variants**: 25
- **Properties**:
  - `Content#61:0` (TEXT) [default: Typography]
  - `Variant` (VARIANT) — options: body1, body2, subtitle1, subtitle2, overline, caption, h6, h5, h4, h3 (+3 more) [default: body1]
  - `Gutter Bottom` (VARIANT) — options: False, True [default: False]

---

## CDS 37 Patterns — Page-Level Components

### AI Patterns

#### `og-assist`
- **Set Key**: `53fcee308bb5622ad4d0add78a454a84fd453261`
- **Default Variant Key**: `deea49797f65d82b2f3674be6f3900b78bcf717c`
- **Variants**: 3
- **Properties**:
  - `Property 1` (VARIANT) — options: Tagline, Icon + Name, Icon Only

#### `Chat Top Bar`
- **Set Key**: `d8fcb40087b69cb1b811b1842920ca0016b2e852`
- **Default Variant Key**: `7c1308f6d39269f755817facede047756c471f82`
- **Variants**: 2
- **Properties**:
  - `State` (VARIANT) — options: Default, Expanded

#### `Chat Bubble`
- **Set Key**: `68bd8b1c9b1e57138daae460df0a3092fb25ad00`
- **Default Variant Key**: `037b939a9e578eee2b3813aa4e0f577322d813a0`
- **Variants**: 2
- **Properties**:
  - `Text#824:4` (TEXT)
  - `Persona` (VARIANT) — options: User, AI

#### `Chat Input`
- **Set Key**: `83fa9c70bc57bda84f416f895ad8530041f5df19`
- **Default Variant Key**: `aa92170b15c3a1a05e4e2138fabe5db4f31206a0`
- **Variants**: 6
- **Properties**:
  - `Prompt Text#824:0` (TEXT)
  - `State` (VARIANT) — options: Default, Active, Loading, Active -  Inline, Attachments, Disabled

#### `AI Chat Floating Button`
- **Set Key**: `2392ccc6b8ac0ab998455b7d87d8f6149ae86dff`
- **Default Variant Key**: `9fb54b8c6b00a4d4cb35da5147f59430cc52dc98`
- **Variants**: 2
- **Properties**:
  - `Size` (VARIANT) — options: Default, Large

### Card

#### `<Card>`
- **Set Key**: `64cde24e60f94cdcfc9f3c4b4c258e4c1c3c26b4`
- **Default Variant Key**: `a1a896588b97b81c3a6165791545dff662053e02`
- **Variants**: 16
- **Properties**:
  - _(property definition error)_

### Drawers

#### `<Drawer>`
- **Set Key**: `da5c11076e0a528f92d2292f2ee37e46f6c86d06`
- **Default Variant Key**: `dbdcb4c880852c5489b1a05911e93c0ee0ca1e3a`
- **Variants**: 9
- **Properties**:
  - `Content` (VARIANT) — options: Table, List, Form, Cards, Workspace toolbar
  - `Persistent` (VARIANT) — options: False, True

#### `.Workspace item`
- **Set Key**: `e8eed58845eef04d230a4b799f7e945ec02f1167`
- **Default Variant Key**: `098526122884f45887e9af7a532d6f730954b211`
- **Variants**: 2
- **Properties**:
  - `Show activity#5649:0` (BOOLEAN)
  - `Icon#6931:0` (INSTANCE_SWAP)
  - `Property 1` (VARIANT) — options: Active, Idle

### Forms

#### `Forms Layouts`
- **Set Key**: `20c55f47a750d1094aad5acf5a133813b27ea2d8`
- **Default Variant Key**: `70a04a925e57292fb91024cde1d095eff0d98940`
- **Variants**: 6
- **Properties**:
  - `Column` (VARIANT) — options: 1 Column, 2 Column, Full Page
  - `Inside Modal` (VARIANT) — options: True, False

#### `FormField`
- **Set Key**: `dcfafbb8b6da166507fa4c92fa8ada619f99c1c4`
- **Default Variant Key**: `6990c9c77d52e8d0ff7e6c37e39d55abd682f759`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: Default (inline), Contained

### Global Navigation

#### `Masthead`
- **Set Key**: `71954bda5e4c20a06848fc184705ef0756633a4e`
- **Default Variant Key**: `7b0d7153f2d7719fba5b61181a0aed64c213054d`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: Logo lock up, entity logo

#### `Global Navigation`
- **Set Key**: `9c5d216568211b2872ad989e871b1abecfec719b`
- **Default Variant Key**: `c24369659d8f75ec3815d2d3ffb1342dd7e551b5`
- **Variants**: 9
- **Properties**:
  - `Product` (VARIANT) — options: Default, Procurement, B&P, Utility Billing, Asset Management, Agents Studio, Vendor Portal, Command center, Product9
- **Product Variant Keys** (use for suite-specific nav):
  - Default: `c24369659d8f75ec3815d2d3ffb1342dd7e551b5`
  - Procurement: `0fae83904386321411e98e161624e268adeb9421`
  - B&P: `35705b7547c5297e06e23fe6e8128fd1f7a0e3f6`
  - Utility Billing: `3dba805ed57e9a20dac1e8aa086645029ec05c0f`
  - Asset Management: `cdf8e5d33da9e62840d34f374e23024994c0d69f`
  - Agents Studio: `6cd1426337fe22414c939ede70f4aa97630c72a8`
  - Vendor Portal: `2945658715a063337c3e72bd6f557c07e23849f6`
  - Command Center: `011496137077293e614fd65154c6944ca0db6655`
  - Product9 (placeholder): `841c850af045b8606a3cf4cce34cacc57b24216c`

#### `PSP Menu`
- **Component Key**: `16da480901ce5bdd694aa97596f7f6bd3eddff32`
- **Standalone component** (not a component set)
- **Size**: 320 × ~1142 (variable height)
- **Sections**: Entity selector, Action Hubs, Products, Capabilities, Preferences
- **Usage**: NOT included in designs by default. Only use when the user explicitly requests a PSP/Platform Switcher view.
- **Note**: Import via `importComponentByKeyAsync` may time out due to component complexity. If timeout occurs, build manually matching the CDS pattern: 320px wide, white bg, right border, auto-layout vertical, DM Sans typography, highlight current product with Blurple bg.

### Layout

#### `Layout`
- **Set Key**: `ee9ccff43c4c351d1ac5d6546dc5a7d006c87216`
- **Default Variant Key**: `2f58d4a677a686a01cd783aec636ae9669bf9367`
- **Variants**: 2
- **Properties**:
  - `Show Workspace toolbar#5649:3` (BOOLEAN)
  - `Configuration` (VARIANT) — options: Landing page with a header, Simple

### Lists

#### `.Stepper card variations`
- **Set Key**: `0c064c5d2acb15e81539d9794212689c2d58528c`
- **Default Variant Key**: `a6bf6f22ac671745a53f7603dfd14d3cef46e515`
- **Variants**: 5
- **Properties**:
  - `Property 1` (VARIANT) — options: Rejected, Active, Idle (Default), In Progress, Approved

#### `Item list`
- **Set Key**: `41f3f7e503cefdb879c82fd4d9340c52229ce3c2`
- **Default Variant Key**: `cc8fd4814734d1e795b1e05ef6fc187909652644`
- **Variants**: 1
- **Properties**:
  - `Property 1` (VARIANT) — options: Idle (Default)

### Modals

#### `Modal`
- **Set Key**: `7d61207ad735c9b4705cd54163832211d8238b84`
- **Default Variant Key**: `3824c8cef3ec37823d12cb83fa8ccfc0c71de524`
- **Variants**: 3
- **Properties**:
  - `Size` (VARIANT) — options: Default, medium, Fullscreen

### Page Header

#### `Page Header Pattern`
- **Set Key**: `0d6c86e45e52734653f21e06461ada3de429400c`
- **Default Variant Key**: `79fc11455331203e1aa0a2cceadec2b1cd92b8a4`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: Default, Simple

### Platform Navigation

#### `Platform Navigation`
- **Set Key**: `a2f05f4a4f7304555c28d51039163464e4d7fae8`
- **Default Variant Key**: `c2e47a50cd24a330abf74a1b79cabd00c6e96bf3`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: Scrolled, Idle

### Result

#### `Result`
- **Set Key**: `c89cbbfa2f2f7535795d8e002546e413d527fe40`
- **Default Variant Key**: `d49529a04bf65640f902c28a1002df3ca56ef939`
- **Variants**: 16
- **Properties**:
  - `Size` (VARIANT) — options: Small, Medium, Large, XLarge
  - `Outlined` (VARIANT) — options: False, True
  - `Use Illustration` (VARIANT) — options: False, True

### Status Audit

#### `Process status`
- **Set Key**: `7db8e3e97350ef3ac90642e57504cdcc2b9654ea`
- **Default Variant Key**: `1411ac4e39a9e380c53d87e14f79105472103e1c`
- **Variants**: 6
- **Properties**:
  - `Property 1` (VARIANT) — options: Overdue, Approved, Rejected, On hold, Pending, Unread comments

#### `Request status`
- **Set Key**: `cd037589de1f92626265660df6cd8d04b63d7099`
- **Default Variant Key**: `f8a9eca1bb532fb2f8511cfe5033acc25164d34a`
- **Variants**: 5
- **Properties**:
  - `Property 1` (VARIANT) — options: In Progress, Reject, Approved, On Hold, Sync

#### `Request filters`
- **Set Key**: `83bc816fa7471efce15a7d3d0db4fb6dc2fdea4c`
- **Default Variant Key**: `d231300882d9cee7576037c2083c1a8f2b46173c`
- **Variants**: 5
- **Properties**:
  - `Property 1` (VARIANT) — options: In Progress, Reject, Approved, On Hold, Sync

#### `Form type status`
- **Set Key**: `2bf9e3d44702130b10d56a1f1593db436d5a43e5`
- **Default Variant Key**: `f075f4208b80f17faca570dc0fa4c58a2647e5db`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: Draft, Live

#### `Form type filters`
- **Set Key**: `392b6d370bb00ebcfad1bff70b6236dea127f932`
- **Default Variant Key**: `38e755d358d2b24bbcf3b94236c4f275f6549867`
- **Variants**: 2
- **Properties**:
  - `Property 1` (VARIANT) — options: Draft, Live

#### `Task status`
- **Set Key**: `1097ca4e845552b76234a009425a9b96677bb567`
- **Default Variant Key**: `2bbf749ab39a1a820232c040a9fcdf807f071781`
- **Variants**: 3
- **Properties**:
  - `Property 1` (VARIANT) — options: Due Date, Close to Due, Overdue

#### `Date status`
- **Set Key**: `80f632e87ef2871bb192b330cd5d379099af1587`
- **Default Variant Key**: `abc4dd7f184769cdd192ac6f5070f563878e75a3`
- **Variants**: 3
- **Properties**:
  - `Property 1` (VARIANT) — options: Overdue, Due soon, Approved

### Templates

#### `Templates`
- **Set Key**: `3d01d22b2360229edf450e06b3971c315b4c87e0`
- **Default Variant Key**: `738a959f6e6eb1600a78d66bbde32f08523886b4`
- **Variants**: 15
- **Properties**:
  - `Property 1` (VARIANT) — options: Detail, Landing page, Navigator, Table, Workflow
  - `Device` (VARIANT) — options: Desktop, Tablet, Phone

### Upload File

#### `Drag and Drop`
- **Set Key**: `54717ce9e6ba5b50b7ba7a852b2a097729d922fd`
- **Default Variant Key**: `1cff664baecef4389b3b1e1d657b6eef76d7ec49`
- **Variants**: 4
- **Properties**:
  - `State` (VARIANT) — options: Idle, Hover
  - `Size` (VARIANT) — options: Large, Smal, Small

#### `File`
- **Set Key**: `c671b4220deb95242617355a3f31318749d302e9`
- **Default Variant Key**: `7db4dc4a3984476b23dddbf26b523d76537734ac`
- **Variants**: 4
- **Properties**:
  - `State` (VARIANT) — options: Default, Selected
  - `Card` (VARIANT) — options: False, true

---

## CDS 37 Icons — Component Sets

#### `product-finance` (Icons)
- **Set Key**: `6876306fbf8d55e99a235783244fdafdbb48a9a9`
- **Default Variant Key**: `748067636b76b4e69d1a767137104344b2d2b719`
- **Variants**: 1
- **Properties**:
  - `Property 1` (VARIANT) — options: Default

#### `collections_bookmark` (Icons)
- **Set Key**: `62a9661acdbe2c5d0afa56790caff2a2bae6b827`
- **Default Variant Key**: `34aa9586ff69e4a486ecdaf4ee616112e98c468b`
- **Variants**: 5
- **Properties**:
  - `Style` (VARIANT) — options: Filled, Outlined, Round, Sharp, Two Tone

#### `.base/Capital snooze` (Illustrations)
- **Set Key**: `5affecbda32c39485f948f406c9880c37ad158ac`
- **Default Variant Key**: `0bdecc24695251b2e41537fffd4e6a043fd046ea`
- **Variants**: 2
- **Properties**:
  - `Show Snooze#4:0` (BOOLEAN)
  - `State` (VARIANT) — options: Default, Animated

#### `OpenGov Logo` (Logos)
- **Set Key**: `c264e3128c00a5ca828fc0335728425bf84ac91d`
- **Default Variant Key**: `d479b157ad9c9f53f63a950c5226dbdb08c04e4c`
- **Variants**: 4
- **Properties**:
  - `Color` (VARIANT) — options: Black, White
  - `Style` (VARIANT) — options: Single Color, Two Color

#### `OpenGov Wand` (Logos)
- **Set Key**: `7e6dd4b4284dfae63727871e6de4243bc09a76f2`
- **Default Variant Key**: `490f0431baacb7b354e6212f3c565e86bf24b0f6`
- **Variants**: 3
- **Properties**:
  - `Color` (VARIANT) — options: Default, White, Black

#### `Product Logo` (Logos)
- **Set Key**: `04038a0a8d326c3a9ffa33a4307f58dbbafa82ee`
- **Default Variant Key**: `80cc03b41469f8611d00caad26e31cb6e3730bdf`
- **Variants**: 12

#### `og-assist-tagline` (Logos)
- **Set Key**: `1e60ec4606f6e30740f091e3f6af0f5d77e3ddf2`
- **Default Variant Key**: `03b9138269dbddb05baf3549c462f90919aeb44c`
- **Variants**: 2
- **Properties**:
  - `Size` (VARIANT) — options: Full, Compact
