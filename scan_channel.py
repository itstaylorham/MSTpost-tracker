import pyautogui
import time
import keyboard
from datetime import datetime

def safe_scroll():
    """
    Gently scroll up through browser content with safety checks
    and smoother scrolling to avoid triggering browser controls.
    """
    # Gentle scroll settings
    SCROLL_AMOUNT = 800        # Smaller amount per scroll
    MICRO_SCROLLS = 2         # Number of micro-scrolls per cycle
    SCROLL_PAUSE = 1.0        # Pause between scroll cycles
    MICRO_PAUSE = 0.0         # Pause between micro-scrolls
    
    print("\n=== Browser-Safe Auto Scroll ===")
    print("Starting in 5 seconds...")
    print("1. Switch to your browser window")
    print("2. Make sure the chat/content is visible")
    print("3. Press 'q' any time to stop")
    print("4. Press 'p' to pause/resume")
    time.sleep(5)
    
    # Get initial mouse position
    scroll_position = pyautogui.position()
    print(f"\nScrolling will begin at position: {scroll_position}")
    
    paused = False
    scroll_count = 0
    
    try:
        while True:
            # Check for quit command
            if keyboard.is_pressed('q'):
                print("\nStopping scroll...")
                break
                
            # Check for pause command
            if keyboard.is_pressed('p'):
                paused = not paused
                print("\nPAUSED..." if paused else "\nRESUMING...")
                time.sleep(0.5)  # Prevent multiple toggles
                continue
                
            if not paused:
                # Perform gentle scrolling
                for _ in range(MICRO_SCROLLS):
                    pyautogui.moveTo(scroll_position)
                    pyautogui.scroll(SCROLL_AMOUNT)
                    time.sleep(MICRO_PAUSE)
                
                scroll_count += 1
                current_time = datetime.now().strftime("%H:%M:%S")
                print(f"Scroll #{scroll_count} at {current_time}")
                
                time.sleep(SCROLL_PAUSE)
            
            else:
                time.sleep(0.1)  # Reduce CPU usage while paused
                
    except Exception as e:
        print(f"\nError occurred: {e}")
    
    finally:
        print(f"\nScroll session ended. Total scrolls: {scroll_count}")

if __name__ == "__main__":
    # Set up safety features
    pyautogui.FAILSAFE = True  # Moving mouse to corner will stop script
    
    try:
        safe_scroll()
    except KeyboardInterrupt:
        print("\nScript stopped by user")
    except Exception as e:
        print(f"\nUnexpected error: {e}")