# CDS 37 Design Tokens — Complete Style & Variable Reference

All tokens from CDS 37 core library (`MxdeZ8e13qSmlenBVMmzzI`).
**NEVER create local copies.** Always import from the library.

## Text Styles (54 total)

### Usage

```javascript
// Import a text style by key, then apply to a text node
const style = await figma.importStyleByKeyAsync(styleKey);
await textNode.setTextStyleIdAsync(style.id);
```

### Typography Styles

| Style Name | Size | Weight | Key |
|-----------|------|--------|-----|
| `typography/Display 1` | 80px | Bold | `c807d3652cb78619c410f0f67eb72ee7d8542ccf` |
| `typography/Display 2` | 72px | Bold | `1852da2be3925bdc31477fecaaaa91c1973492e9` |
| `typography/Display 3` | 64px | Bold | `d48fd40f9f737edabe1392ce4eef46e8b2e9725a` |
| `typography/Display 4` | 48px | Bold | `c6bee60067a6a25f45c7bf612d9871da1009df24` |
| `typography/Display 5` | 40px | Bold | `fb42ca3fe208e7937f5c9e401151889a65c7890e` |
| `typography/h1` | 32px | SemiBold | `3951ac1380692cc265c3c34dc9a6de06f7a8cd7b` |
| `typography/h2` | 24px | SemiBold | `6cf42b54f5be7dddbbe18b05f9d6869d6276fe00` |
| `typography/h3` | 20px | SemiBold | `74f3552f49b3c03c91234b606d7c63c15c7ac7dd` |
| `typography/h4` | 16px | SemiBold | `eb8c8f295bb8e40ac267d2c626c7bbb0f56d8f7f` |
| `typography/h5` | 14px | SemiBold | `68788195cb9117147385a04550cbe87479249e0c` |
| `typography/h6` | 12px | SemiBold | `e7f596274da2deba475efc2e88bec9a56156899f` |
| `typography/body1` | 16px | Regular | `178d78f7c340b70b643a05a7e768640655abd231` |
| `typography/body2` | 14px | Regular | `213cabbb6965c1f310536cb317d976f060e2cf3b` |
| `typography/body3` | 12px | Regular | `4fe6df4072126a8d132f548df7a7802e74a5b800` |
| `typography/subtitle1` | 16px | Regular | `b4f1514de40a3ed4e5b037d92030b7420bdc054a` |
| `typography/subtitle2` | 14px | Regular | `767d25d675dd5bcfd9386a2327a99f2391e40f7d` |
| `typography/overline` | 12px | Medium | `b6f2714c6174d7f0ab58d63d6a54ad1b1276f8bf` |
| `typography/caption` | 12px | Regular | `b9f1b832f90acd527efc3000e59c7c72d3d3ab0c` |
| `typography/display1` | 56px | Regular | `079932ddbfcd7949eab1c86df7e54f875bb032c9` |
| `typography/display2` | 40px | Regular | `3e2db5e066194ab3a537c92d0789733e44e8b9d0` |
| `typography/display3` | 32px | Regular | `519baa6b3a3610c7fab30c4bea46cf9e65242cad` |

### Component-Specific Styles

| Style Name | Size | Weight | Key |
|-----------|------|--------|-----|
| `Inputs/Label sm` | 12px | Regular | `1a79c722c5e42d493bc02db634ad159a5ea5cf61` |
| `Inputs/Label md` | 14px | Regular | `0ac4898296cb4c82ae963061da23df10dd086ec4` |
| `Inputs/Label lg` | 16px | Regular | `109af1b843569f3f8a344c70eadde971d7cf6c30` |
| `Inputs/Value sm` | 12px | Medium | `78d364c6c56e752aa6cf5362e4fa7d94e71eb65e` |
| `Inputs/Value md` | 14px | Medium | `4656e05664685b7b0a887046aef7f2ac7d2dfce4` |
| `Inputs/Value lg` | 16px | Medium | `93580d9088aa2e5c988b839fa945498fc653c47d` |
| `Inputs/Helper` | 12px | Medium | `ce198e20df4bef104e42c9419c53a03e87e42821` |
| `Inputs/Description` | 12px | Regular | `17f5da204a6bac19b8a26a4d0d9c76c59bc4967d` |
| `Button/large` | 16px | Medium | `193d7f5606ac696833a2e62e835f46f894de1b52` |
| `Button/medium` | 14px | Medium | `02659678b7c961f57a5dc23790723b1e754d2dab` |
| `Button/small` | 12px | Medium | `804ea4743e2fc4a80bda4ca8763e2a03de2d1f2f` |
| `Chip/large` | 14px | Medium | `deaa921c16db379d6724b0a63b77bd991bd2b95e` |
| `Chip/medium` | 13px | Medium | `45afd2107ebf9809dbf6c102d10a9ed3386f7d6b` |
| `Chip/small` | 12px | Medium | `47ae5a46a0751c8437b5ed3d9758391c111ad282` |
| `Avatar/Initials Lg` | 16px | SemiBold | `9695ebd75d7eb867c42a7c9575fd1548f3b9c77c` |
| `Avatar/Initials md` | 12px | SemiBold | `695d57972942a4fdd037577b667ad41cb549d4b1` |
| `Avatar/Initials sm` | 10px | Regular | `fec4fb06962670c2e09d71e482763be2cd9d7aed` |
| `Table/Header` | 16px | Medium | `28cb377a523c3f90befb67b584e28f3265e8f1a1` |
| `Table/Cell` | 14px | Regular | `3b34f151265c56f98b96de3d047f931578236c81` |
| `Table/Footer` | 14px | Regular | `862a02091bf3bfe62a929976aad6425ee7232f3a` |
| `Tooltip/small` | 10px | Medium | `fb8971036571230cbac3e0e129aab9c15d018937` |
| `Alert/title` | 12px | Bold | `befbe1b1db770e90d66c547f65a9f0b982a86de4` |
| `Alert/description` | 14px | Medium | `ce43fdbdf35474535b1bd8ea651ed100ae37f564` |
| `bottomNavigation/activeLabel` | 14px | Medium | `d295ed9efe5d01ce1f05fa76c0f55cc265447906` |
| `bottomNavigation/defaultLabel` | 12px | Regular | `b26879afbc5847e7f8045e57897cf42bd9a31ece` |
| `Menu/itemDefault` | 16px | Regular | `f3e21e7b1931f327af5b3dbec1a9cf67a82ea452` |
| `Menu/itemDense` | 14px | Regular | `dd0c17cce9d6defdd610879dfabea9740133db44` |
| `badge/label` | 12px | Medium | `8274cff1d1ef0c8ff33926d8586180ab8a141825` |
| `datePicker/currentMonth` | 16px | Medium | `474bdfea0c7c13fa20561738e120e28f3a1bc02b` |
| `list/subheader` | 14px | Medium | `7c313e2f996ec98c954ba4ef9ba0c2215eda5d73` |
| `dataGrid/aggregationColumnHeaderLabel` | 12px | Medium | `3e980d10cf4ec908eb86d7d40e10a31132e63a66` |
| `_library/heading` | 64px | Bold | `03fdc3a685b15cde6206f889f4278f9289b6e79c` |
| `charts/group` | 12px | Regular | `8d84d814da2c57177c890c03e6a76374eb1ecfd1` |

### fontSize + fontWeight → Style Mapping

Use this for auto-applying text styles to existing text nodes:

| fontSize | fontWeight | Best Match Style |
|----------|-----------|------------------|
| 80px | Bold | `typography/Display 1` |
| 72px | Bold | `typography/Display 2` |
| 64px | Bold | `typography/Display 3` |
| 56px | Regular | `typography/display1` |
| 48px | Bold | `typography/Display 4` |
| 40px | Bold | `typography/Display 5` |
| 40px | Regular | `typography/display2` |
| 32px | SemiBold | `typography/h1` |
| 32px | Regular | `typography/display3` |
| 24px | SemiBold | `typography/h2` |
| 20px | SemiBold | `typography/h3` |
| 16px | SemiBold | `typography/h4` |
| 16px | Regular | `typography/body1` |
| 16px | Medium | `Button/large` |
| 14px | SemiBold | `typography/h5` |
| 14px | Regular | `typography/body2` |
| 14px | Medium | `Button/medium` |
| 13px | Medium | `Chip/medium` |
| 12px | SemiBold | `typography/h6` |
| 12px | Regular | `typography/caption` |
| 12px | Medium | `typography/overline` |
| 12px | Bold | `Alert/title` |
| 10px | Medium | `Tooltip/small` |

## Effect Styles (24 elevation levels)

```javascript
const style = await figma.importStyleByKeyAsync(effectKey);
await frame.setEffectStyleIdAsync(style.id);
```

| Style Name | Key |
|-----------|-----|
| `elevation/1` | `bb7dbbad890c6ff793ae67d0574262fce2f116c5` |
| `elevation/2` | `4ebe2e39bf101e2e5a1c053f5d22c0487f275a6a` |
| `elevation/3` | `9772c34fa8b7e900b40e444a03f050be7effd244` |
| `elevation/4` | `3b820a202ba3478bb8902df666d30f8080b0abd7` |
| `elevation/5` | `25fb2345484fc2b6f7c5c18f9abf804eebfab2b5` |
| `elevation/6` | `e27505e4a881fec45b7b5c852cfa3e7e26847dcb` |
| `elevation/7` | `78b15a6ab1042363f5704f41af9d0eed4f2dea54` |
| `elevation/8` | `20c7b9c215f2b383f84c24be273c067c6348818f` |
| `elevation/9` | `bac9b6dd6377867617aa2ff529145f529ea57968` |
| `elevation/10` | `648e4a46ef709ba162d168493dd083f33357c711` |
| `elevation/11` | `703428bb5423c01815a5a5506ff90ba9e5e3c986` |
| `elevation/12` | `a1f9ca5ef4356e56bbe8d872e2d391944d8500a8` |
| `elevation/13` | `e2bc5344c82172e504cf5b36e32880b8936104a1` |
| `elevation/14` | `819f7648e42f6095dd8c183e9eaf10b081ba307e` |
| `elevation/15` | `c39c75592c878434a34324b70b8b8518e62c32fc` |
| `elevation/16` | `4cf7da6f289554bd07d14d18e55ae9569d433042` |
| `elevation/17` | `9e5d9d534cb9b1321ec7d6768d08c39f7421311e` |
| `elevation/18` | `6eb5e0faa88d8ad924caed4a7817eacc4e90f79f` |
| `elevation/19` | `c82be7cc72b48055799494830e3f70581cc23e9a` |
| `elevation/20` | `0ccc7ca5d04b5bc7ad10103944fe4a45f61d9059` |
| `elevation/21` | `b5746001fbb75f11ac459db1731c297450942b37` |
| `elevation/22` | `03982874ccb37185855eca400c53a247c5890281` |
| `elevation/23` | `ee62e59c63d9bd91018c26ae1561a22a0cd3d6d2` |
| `elevation/24` | `5652ba79d75e31aae9982963b4527370fa4e61c9` |

## Color Variable Collections

| Collection | Key | Variables |
|-----------|-----|-----------|
| `metadata` | `16dd56d681fe63de0fb499f6229515f0baa327a2` | 1 |
| `device` | `403912f74ec36431b3dac498b16d6cf76db98e42` | 3 |
| `Foundation` | `6efb9c548576b1baef86d61846492f0f246608d1` | 284 |
| `Semantic (Display)` | `6bee5db18bba12e4ecb5c818691a97085b97fb82` | 318 |
| `Semantic (Theme)` | `47a7eb8a2e00679fcecf9189ab26bef008524e55` | 239 |

## Semantic Color Variables (Most Used)

These are the semantic colors from the `Semantic (Theme)` collection used in designs.

### Usage

```javascript
// Import a variable by key, then bind to a paint
const variable = await figma.variables.importVariableByKeyAsync(varKey);
const paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
node.fills = [figma.variables.setBoundVariableForPaint(paint, 'color', variable)];
```

| Variable Name | Key | Hex | Usage |
|-------------|-----|-----|-------|
| `Colors/primary/main` | `17d88b1b3dbec658b6fcbb5eeaa572643304f54e` | `#4b3fff` | Brand, active states, links |
| `Colors/primary/dark` | `6fe4f66a573befab614f8abc59a73c60e15fccc7` | — | Hover on primary |
| `Colors/primary/light` | `3e33997a5286ea355474013b95990b81e7f54bcf` | — | Light primary backgrounds |
| `Colors/primary/contrastText` | `8b91295e2aa06f5a24be2183a70bd78c776b1f40` | `#ffffff` | White text on primary |
| `Colors/secondary/main` | `374f6557312280d07693087b2266f90d8b77ed74` | `#546574` | Secondary actions |
| `Colors/secondary/dark` | `9ba377c59887b7d4bb728e372f8eb81169187384` | — | Hover on secondary |
| `Colors/secondary/light` | `7d05447c2dfbdce10a7f39632eaf083dbf7a8264` | — | Light secondary backgrounds |
| `Colors/secondary/contrastText` | `77ef72c77f83e75c473c6fe9df71bf8a9816c32b` | — | Text on secondary |
| `Colors/error/main` | `6e95dc04449b16b81c035fed90619098b23a31ca` | `#d32f2f` | Error, destructive |
| `Colors/error/light` | `b81151627370e27c838c79738ac84fe27cdc124b` | — | Light error bg |
| `Colors/error/dark` | `b11000b4355695fbb7aca635e13aa392d607cb4d` | — | Hover on error |
| `Colors/error/contrastText` | `63e1e2031c1eee1c374b7aed3806f82a1dd09791` | — | Text on error |
| `Colors/error/color` | `f583cbdb2cd7664883aeeb6e5be6de3174d9e60d` | — | Error alert color |
| `Colors/error/background` | `f5806e4c633546962157e9c66b227cc0454e797e` | — | Error alert bg |
| `Colors/warning/main` | `a5752b26f275ed6c73ae93dceba16cfe33401f81` | `#ed6c02` | Warning indicators |
| `Colors/warning/light` | `cb93a2cdb1501300ac9fa601523d3eb251c5cfb4` | — | Light warning bg |
| `Colors/warning/dark` | `6e0eed496d0663ee58adcd3c647364c5b24e84aa` | — | Hover on warning |
| `Colors/warning/contrastText` | `8b8765694571a64ed98f94d894db993143982550` | — | Text on warning |
| `Colors/warning/color` | `d0e17710dc39d927c9274e32aab549e6e23709b1` | — | Warning alert color |
| `Colors/warning/background` | `a1f5df9aef39bb64e37906a072988d06a1f4dfb4` | — | Warning alert bg |
| `Colors/info/main` | `7f72b4c3a13333f7324d16df08e88332471d25e0` | `#0288d1` | Informational |
| `Colors/info/light` | `167088804b8646021689ce97f094bb12083324cf` | — | Light info bg |
| `Colors/info/dark` | `55e9dccc86fd902f75695371d347f7e0b1e862bc` | — | Hover on info |
| `Colors/info/contrastText` | `64570d94129e5ae0a417d58ef1804c7dfb43e479` | — | Text on info |
| `Colors/info/color` | `11423e7b9378dae3b4fb94c9c7df954d3ceabd11` | — | Info alert color |
| `Colors/info/background` | `d61121f76e39294e60b7425435752bd731bf9ef3` | — | Info alert bg |
| `Colors/success/main` | `cfc60e9d1f9af9567185e93af3e73f030a02f724` | `#2e7d32` | Success states |
| `Colors/success/light` | `d08acca499088f7abf32578c18c0e0029b948d20` | — | Light success bg |
| `Colors/success/dark` | `b6e8016d546b1e54757bb812039418c593aa91f6` | — | Hover on success |
| `Colors/success/contrastText` | `db86b4451448355400b93b16c13f4713a0145e23` | — | Text on success |
| `Colors/success/color` | `2e1ebb5b2ca42eb3c4d816decf627076b7a59251` | — | Success alert color |
| `Colors/success/background` | `1eeae4e676f04c3a033c777ad6656061e434f1a5` | — | Success alert bg |
| `Colors/text/primary` | `c45fa8f7347b51c3bd7302deefb9e1edeeee9271` | `#212121` | Headings, primary body |
| `Colors/text/secondary` | `1aa140f793df4f3ce76d2ae909c78c0360b50aab` | `#666666` | Labels, secondary text |
| `Colors/text/disabled` | `39271f756d2f79b7f05c56e2ec926e051c3b1a0d` | — | Disabled text |
| `Colors/background/default` | `3344db1eb6b5ccbfb6eeb412b13967907088d717` | — | Page default bg |
| `Colors/background/secondary` | `40a0429635dc28c95b256f86e86f31b8c81671ca` | — | Secondary bg |
| `Colors/background/tertiary` | `4427f744e224f749a7d0a43553a58fa962bb8376` | `#f5f5f5` | Page background |
| `Colors/background/paper-elevation-0` | `70597df059e67b9286730e00064743f0bfec94c3` | `#ffffff` | Cards, dialogs, sidebar |
| `Colors/action/active` | `766968d92ecd79de0fc2b4afb248bb60731a33bc` | `#54616d` | Dividers, borders |
| `Colors/action/hover` | `30d42c93d009ba5d32c0f29754f108835bc189a9` | — | Hover state |
| `Colors/action/selected` | `31b3d3fda8585edf9af795a0bf92050b4b56e885` | — | Selected state |
| `Colors/action/disabled` | `8fce58c19de745a9457490fe71bd63012d979734` | — | Disabled actions |
| `Colors/action/disabledBackground` | `700da8ffa2346a6c29d356fa59fc3fa07ebfa9fa` | — | Disabled action bg |
| `Colors/elevation/outlined` | `710f41db723f46a2eae1f6a5e8de84217adcf67f` | — | Outlined borders |
| `Colors/avatar/fill` | `6129eed05091f493005ea04b8fc12fae12e1da1b` | — | Avatar backgrounds |
| `Colors/tooltip/fill` | `1f1d066e8107097d1055aec117399822166db85b` | — | Tooltip bg |
| `Colors/snackbar/fill` | `8dbc84104cfb238779d871f6af59eef0df029081` | — | Snackbar bg |
| `Colors/backdrop/fill` | `6cbbd1d7837cabb0a4fd9ffde9c0557df60bc4f6` | — | Modal backdrop |

## Foundation Palette Colors

The Foundation collection contains 284 palette variables organized by color family.
Each family has shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, A200, A400, A700.

| Family | Key (500 shade) | Notes |
|--------|----------------|-------|
| `Colors/blurple` | `2e45f4426a511eda78a6153138dc1e5b74c5bd61` | Primary brand color |
| `Colors/slate` | `032881e90126b266ecd9700563682c6ab3dfc3f2` | Secondary brand color |
| `Colors/turquoise` | `c555b77d1c218e4fcdac7e75e48e99911a7ad100` |  |
| `Colors/terracotta` | `02ac8aba1f72618d1427bf15c4f0badf1373364d` |  |
| `Colors/violet` | `21c93d160ff51d0603ff5a19532b23a07019a450` |  |
| `Colors/green` | `0b7615c92cf179a22b11e27251580589238068e6` |  |
| `Colors/cerulean` | `5f237252710827cc1ed2a947d275ddb87d64ce28` |  |
| `Colors/jade` | `48578529b7665af325a549ec26f914347290c3e2` |  |
| `Colors/pear` | `abed214eef57eeef207f1f1b944f5e8d23d86f31` |  |
| `Colors/orange` | `59c84d6bc6efdbeeb42fb5a4ff3ce876f1e917f6` |  |
| `Colors/magenta` | `13883921aa625ac2dcbdf77ce64580717cad5cbf` |  |
| `Colors/purple` | `a44626e3d9c3ffea680495f76945d4016a8d581c` |  |
| `Colors/red` | `cc6616089a7bd0d2605e28186232fa697206e183` |  |
| `Colors/teal` | `60b0b38369345c4c06fe0e0a1bc10af50b6f3029` |  |
| `Colors/yellow` | `d75cecca3170ed20212cafb0c9f71821dce5942c` |  |
| `Colors/periwinkle` | `f069347bb2d681449d58df203b3406bfb50670e9` |  |
| `Colors/marine` | `f32cd168bbef853831084f67a87aa7838a0fa010` |  |
| `Colors/gray` | `d8e9482cdb1988ef3405a9b476895c7d8fa1e5d9` |  |
| `Colors/blue` | `c460b719f4c690a43404a83cbaa79398d75519db` |  |

For the full list of all 382 semantic + 284 foundation variables with their keys,
see the raw JSON at `/tmp/cds37-vars.json` (generated during cataloging).