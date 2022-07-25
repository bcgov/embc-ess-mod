export interface Compute {
  execute(): void;
  triggerCaching(): void;
}
