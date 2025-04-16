import { render, screen, fireEvent } from '@testing-library/react';
import { DogProfileForm } from '../DogProfileForm';

describe('DogProfileForm', () => {
  it('renders the initial step and progress bar', () => {
    render(<DogProfileForm />);
    
    // Check if first step is visible
    expect(screen.getByText('Step 1: Breed Selection')).toBeInTheDocument();
    
    // Check if progress indicators are present
    const progressSteps = screen.getAllByRole('generic').filter(el => 
      el.className.includes('rounded-full')
    );
    expect(progressSteps).toHaveLength(3);
  });

  it('handles navigation between steps correctly', () => {
    render(<DogProfileForm />);
    
    // Initially on step 1
    expect(screen.getByText('Step 1: Breed Selection')).toBeInTheDocument();
    
    // Previous button should be disabled on first step
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
    
    // Click next to go to step 2
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    // Should show step 2
    expect(screen.getByText('Step 2: Basic Information')).toBeInTheDocument();
    
    // Previous button should now be enabled
    expect(previousButton).not.toBeDisabled();
    
    // Go back to step 1
    fireEvent.click(previousButton);
    expect(screen.getByText('Step 1: Breed Selection')).toBeInTheDocument();
  });

  it('shows submit button on final step', () => {
    render(<DogProfileForm />);
    
    // Navigate to last step
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton); // to step 2
    fireEvent.click(nextButton); // to step 3
    
    // Should show submit button instead of next
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });
}); 