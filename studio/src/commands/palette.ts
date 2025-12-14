// Command palette component
export class CommandPalette {
  private element: HTMLElement;
  private backdrop: HTMLElement;
  private input: HTMLInputElement;
  private list: HTMLElement;
  private commands: { name: string; action: () => void }[] = [];
  private isVisible = false;

  constructor() {
    this.backdrop = document.getElementById('command-backdrop')!;
    this.element = document.createElement('div');
    this.element.className = 'command-palette';

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Type a command...';
    this.input.className = 'command-input';

    this.list = document.createElement('ul');
    this.list.className = 'command-list';

    this.element.appendChild(this.input);
    this.element.appendChild(this.list);
    document.body.appendChild(this.element);

    this.backdrop.addEventListener('click', () => this.hide());
    this.input.addEventListener('input', () => this.filterCommands());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide();
      } else if (e.key === 'Enter') {
        const firstItem = this.list.querySelector('.command-item') as HTMLElement;
        if (firstItem) {
          firstItem.click();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.show();
      }
    });
  }

  addCommand(name: string, action: () => void): void {
    this.commands.push({ name, action });
  }

  show(): void {
    this.isVisible = true;
    this.backdrop.style.display = 'block';
    this.element.style.display = 'block';
    this.input.focus();
    this.input.value = '';
    this.filterCommands();
  }

  hide(): void {
    this.isVisible = false;
    this.backdrop.style.display = 'none';
    this.element.style.display = 'none';
  }

  private filterCommands(): void {
    const query = this.input.value.toLowerCase();
    const filtered = this.commands.filter(cmd => cmd.name.toLowerCase().includes(query));

    this.list.innerHTML = '';
    filtered.forEach(cmd => {
      const item = document.createElement('li');
      item.className = 'command-item';
      item.textContent = cmd.name;
      item.onclick = () => {
        cmd.action();
        this.hide();
      };
      this.list.appendChild(item);
    });
  }
}