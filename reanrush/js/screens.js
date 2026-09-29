window.ReanRushPage = { init: function () {
  var groups = [
    { key: 'admin', label: 'Admin', root: 'admin_screen_reanrush', screens: ['activity_log', 'admin_dashboard', 'ai_usage_quotas_ai', 'live_games_monitor', 'reported_content_moderation', 'system_settings', 'user_management'] },
    { key: 'main', label: 'Main site', root: 'Main_page_reanrush', screens: ['404_page_not_found', 'blog_study_hacks', 'brand_logo', 'class_pin_join_lobby', 'forgot_password', 'game_not_found_invalid_pin', 'home_battle_hub', 'log_in_welcome_back', 'no_internet_connection', 'pricing_school_plans', 'settings', 'sign_up_join_the_fun', 'user_profile'] },
    { key: 'class', label: 'Student class', root: 'student_screen_class', screens: ['avatar_gear_shop', 'classes', 'game_modes_curricula'] },
    { key: 'student', label: 'Student', root: 'student_screen_reanrush', screens: ['angkor_boss_battle_arena', 'answer_result_explanation', 'learn_fast._rush_together._landing_page', 'live_battle_arena_1', 'live_battle_arena_2', 'live_battle_leaderboard', 'mistake_vault_review_revenge', 'mobile_choose_team_a_or_b', 'mobile_enter_game_pin', 'mobile_nickname_avatar', 'mobile_player_lobby', 'mobile_practice_mode_calm_study', 'mobile_student_home', 'private_progress_analytics', 'revenge_round_3_minute_recovery_quiz', 'solo_flashcard_study_studio'] },
    { key: 'teacher', label: 'Teacher', root: 'teahcer_host_screen', screens: ['ai_assistant_make_questions_with_ai', 'assign_homework', 'class_detail', 'class_reports_weak_topic_analytics', 'dashboard_my_library', 'discover_quizzes_battle_decks', 'flashcard_creator_studio', 'host_battle_lobby', 'import_questions_dialog', 'live_host_battle_projector_arena', 'quiz_creator_studio', 'review_ai_questions', 'start_game_setup'] }
  ];
  var screens = [];
  groups.forEach(function (group) {
    group.screens.forEach(function (slug) {
      var folder = 'reanrush_' + slug;
      var label = slug.replaceAll('_', ' ').replace(/\b\w/g, function (letter) { return letter.toUpperCase(); }).replaceAll('._', '. ');
      screens.push({ group: group.key, groupLabel: group.label, label: label, html: '../../' + group.root + '/' + folder + '/code.html', image: '../../' + group.root + '/' + folder + '/screen.png' });
    });
  });
  var list = $('#screen-list');
  var preview = $('#screen-frame');
  var title = $('#preview-title');
  var open = $('#open-screen');
  var selected = null;
  function render() {
    var query = $('#screen-search').val().trim().toLowerCase();
    var group = $('#screen-group').val();
    var filtered = screens.filter(function (screen) { return (group === 'all' || screen.group === group) && (screen.label.toLowerCase().includes(query) || screen.groupLabel.toLowerCase().includes(query)); });
    $('#screen-count').text(filtered.length + ' screen' + (filtered.length === 1 ? '' : 's'));
    list.html(filtered.map(function (screen) {
      var active = selected && selected.html === screen.html;
      return '<button class="screen-item" type="button" data-screen-url="' + screen.html + '" aria-pressed="' + Boolean(active) + '"><img loading="lazy" src="' + screen.image + '" alt=""><span><strong>' + screen.label + '</strong><small>' + screen.groupLabel + '</small></span></button>';
    }).join('') || '<p class="muted">No screens match that search.</p>');
    if (!selected && filtered.length) show(filtered[0]);
  }
  function show(screen) {
    selected = screen;
    title.text(screen.label);
    preview.attr('src', screen.html);
    open.attr('href', screen.html);
    list.find('.screen-item').attr('aria-pressed', 'false').filter('[data-screen-url="' + screen.html + '"]').attr('aria-pressed', 'true');
  }
  $('#screen-search, #screen-group').on('input change', render);
  list.on('click', '.screen-item', function () { var url = $(this).attr('data-screen-url'); show(screens.find(function (screen) { return screen.html === url; })); });
  render();
} };
