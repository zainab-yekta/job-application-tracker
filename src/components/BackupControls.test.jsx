import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackupControls from './BackupControls';
import { createBackup } from '../utils/backup';

const job = {
  id: 1,
  title: 'Frontend Developer',
  company: 'Shopify',
  location: '',
  status: 'Applied',
  appliedDate: '2026-05-01',
  interviewDate: '',
  interviewTime: '',
};

const jsonFile = (content) =>
  new File([typeof content === 'string' ? content : JSON.stringify(content)], 'backup.json', {
    type: 'application/json',
  });

describe('BackupControls', () => {
  afterEach(() => vi.restoreAllMocks());

  it('restores the jobs from a backup after confirming', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<BackupControls jobs={[]} onImport={onImport} />);

    await user.upload(
      screen.getByLabelText('Choose a backup file to restore'),
      jsonFile(createBackup([job])),
    );

    expect(onImport).toHaveBeenCalledWith([job]);
    expect(await screen.findByRole('status')).toHaveTextContent('Restored 1 application.');
  });

  it('changes nothing when the restore is cancelled', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<BackupControls jobs={[]} onImport={onImport} />);

    await user.upload(
      screen.getByLabelText('Choose a backup file to restore'),
      jsonFile(createBackup([job])),
    );
    expect(onImport).not.toHaveBeenCalled();
  });

  it('explains what is wrong with a bad file', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<BackupControls jobs={[]} onImport={onImport} />);

    await user.upload(screen.getByLabelText('Choose a backup file to restore'), jsonFile('oops'));

    expect(await screen.findByRole('alert')).toHaveTextContent('not a valid backup');
    expect(onImport).not.toHaveBeenCalled();
  });

  it('only offers a download when there is something to back up', () => {
    const { rerender } = render(<BackupControls jobs={[]} onImport={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Download backup' })).toBeDisabled();
    rerender(<BackupControls jobs={[job]} onImport={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Download backup' })).toBeEnabled();
  });
});
