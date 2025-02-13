function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('expanded');
    
    const content = document.querySelector('.content');
    if (sidebar.classList.contains('expanded')) {
        content.style.marginLeft = '200px';
    } else {
        content.style.marginLeft = '60px';
    }
}
