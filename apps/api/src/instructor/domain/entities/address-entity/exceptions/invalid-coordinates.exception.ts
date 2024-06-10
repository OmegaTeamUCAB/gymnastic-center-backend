import { DomainException } from "@app/core";

export class InvalidCoordinatesException extends DomainException {
  constructor() {
    super('Invalid Coordinates');
  }
}