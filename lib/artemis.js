var artemis = {
  // utils
  bag: bag,
  bitSet: bitSet,
  fastMath: FastMath,
  timer: timer,
  // main classes
  world: world,
  manager: manager,
  entity: entity,
  entityManager: entityManager,
  entityObserver: entityObserver,
  entitySystem: entitySystem,
  component: component,
  componentManager: componentManager,
  // statics
  Aspect: Aspect,
  ComponentMapper: ComponentMapper,
  ComponentType: ComponentType,
  ExtendHelper: ExtendHelper,
  // managers
  groupManager: groupManager,
  playerManager: playerManager,
  tagManager: tagManager,
  teamManager: teamManager,
  // systems
  delayedEntityProcessingSystem: delayedEntityProcessingSystem,
  entityProcessingSystem: entityProcessingSystem,
  intervalEntitySystem: intervalEntitySystem,
  intervalEntityProcessingSystem: intervalEntityProcessingSystem,
  voidEntitySystem: voidEntitySystem
};