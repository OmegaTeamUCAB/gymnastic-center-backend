import { DomainService } from '@app/core';
import { CompletionPercentage } from '../entities/user-progress/value-objects';
import { InvalidCompletionPercentageException } from '../entities/user-progress/exceptions';

type CalculateCompletionPercentageInput = {
  lastSecondWatched: number;
  totalSeconds: number;
  markAsCompleted: boolean;
};

export class CalculateCompletionPercentage
  implements
    DomainService<CalculateCompletionPercentageInput, CompletionPercentage>
{
  execute(data: CalculateCompletionPercentageInput): CompletionPercentage {
    const { lastSecondWatched, totalSeconds, markAsCompleted } = data;
    if (markAsCompleted) return CompletionPercentage.completed();
    if (totalSeconds < lastSecondWatched)
      throw new InvalidCompletionPercentageException();
    if (totalSeconds <= lastSecondWatched + 5)
      return CompletionPercentage.completed();
    return new CompletionPercentage((lastSecondWatched * 100) / totalSeconds);
  }
}
