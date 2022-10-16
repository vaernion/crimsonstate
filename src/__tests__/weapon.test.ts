import { WeaponName, weaponVariants } from "../data/weapons";
import { Vector } from "../entity";
import { Player } from "../player";
import { Projectile } from "../projectile";
import { Weapon } from "../weapon";

describe("weapon", () => {
  it("shoots correctly", () => {
    const weapon = new Weapon(WeaponName.hk45, 1);
    const weaponVariant = weaponVariants[WeaponName.hk45];
    const shooter = new Player(0, 0, new Vector());
    const projectiles = new Set<Projectile>();
    const gameTimeStart = 100;

    const { cooldown } = weaponVariant;

    expect(weapon.isShootReady(gameTimeStart)).toEqual(true);
    const didShoot = weapon.shoot(
      gameTimeStart,
      projectiles,
      shooter,
      new Vector()
    );
    expect(didShoot).toEqual(true);
    expect(projectiles.size).toEqual(1);
    expect(weapon.magazine).toEqual(weaponVariant.magazineMax - 1);

    const middleOfShootCooldown = gameTimeStart + cooldown / 2;
    expect(weapon.isShootReady(middleOfShootCooldown)).toEqual(false);

    const gameTimeFinishedCoolingDown = gameTimeStart + cooldown;
    expect(weapon.isShootReady(gameTimeFinishedCoolingDown)).toEqual(true);
  });

  it("reloads correctly", () => {
    const weapon = new Weapon(WeaponName.hk45, 1);
    const weaponVariant = weaponVariants[WeaponName.hk45];
    const shooter = new Player(0, 0, new Vector());
    const projectiles = new Set<Projectile>();
    const gameTimeStart = 100;

    const { reloadTime } = weaponVariant;

    expect(weapon.isReloadDone(gameTimeStart)).toEqual(true);
    expect(weapon.checkReload(gameTimeStart)).toEqual(false);

    const startedReloadAtFullAmmo = weapon.startReload(gameTimeStart);
    expect(startedReloadAtFullAmmo).toEqual(false);
    const reloadedAtFullAmmo = weapon.checkReload(gameTimeStart);
    expect(reloadedAtFullAmmo).toEqual(false);

    weapon.shoot(gameTimeStart, projectiles, shooter, new Vector());

    const startedReload = weapon.startReload(gameTimeStart);
    expect(startedReload).toEqual(true);
    expect(weapon.checkReload(gameTimeStart)).toEqual(false);
    expect(weapon.checkReload(gameTimeStart + reloadTime / 2)).toEqual(false);
    expect(weapon.checkReload(gameTimeStart + reloadTime)).toEqual(true);
    expect(weapon.magazine).toEqual(weaponVariant.magazineMax);
  });
});
